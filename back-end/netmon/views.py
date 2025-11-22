from rest_framework.decorators import api_view
from rest_framework.response import Response
from scapy.all import sniff,IP,TCP,UDP,DNS,Raw
from scapy.data import IP_PROTOS
from .models import Packet
from datetime import datetime
from zoneinfo import ZoneInfo
from django.utils.timezone import now

from netmon.serializers import PacketSerializer


COMMON_PORTS = {
    80: "HTTP", 443: "HTTPS", 53: "DNS", 25: "SMTP", 22: "SSH",
    21: "FTP", 110: "POP3", 143: "IMAP", 23: "TELNET", 67: "DHCP", 68: "DHCP",
    123: "NTP", 161: "SNMP", 162: "SNMPTRAP", 69: "TFTP", 3306: "MySQL",
    1433: "MSSQL", 1521: "OracleDB", 3389: "RDP", 5900: "VNC"
}


@api_view(['GET'])
def noPackets(request):
    packets=Packet.objects.count()
    return Response(packets)
@api_view(['POST'])
def getPackets(request):
    timezone = ZoneInfo("Asia/Karachi")
    local_time = now().astimezone(timezone)
    packets = sniff(timeout=1)

    return Response({"count":len(packets),
                     "time":local_time.strftime("%H:%M:%S")})



@api_view(['POST'])
def getRecentPackets(request):
    packets = sniff(count=50)
    saved_data = []

    for packet in packets:
        if IP not in packet:
            continue

        # Transport layer protocol
        proto_num = packet[IP].proto
        try:
            transport_proto = IP_PROTOS[proto_num]
        except (KeyError, AttributeError):
            transport_proto = str(proto_num)

        app_layer_proto = "Unknown"
        payload_summary = None
        sport = dport = None

        # Extract ports and payload if TCP/UDP
        if TCP in packet:
            sport = packet[TCP].sport
            dport = packet[TCP].dport
            if Raw in packet:
                raw_data = packet[Raw].load.decode(errors="ignore")
                # HTTP detection
                if raw_data.startswith(("GET", "POST", "PUT", "DELETE")):
                    app_layer_proto = "HTTP"
                    lines = raw_data.split("\r\n")
                    http_info = {}
                    for line in lines[:10]:
                        if line.startswith("Host:"):
                            http_info["host"] = line.split(":", 1)[1].strip()
                        elif line.startswith(("GET", "POST", "PUT", "DELETE")):
                            http_info["method"], http_info["path"], _ = line.split()
                    payload_summary = http_info
                # SMTP detection
                elif raw_data.startswith(("EHLO", "HELO", "MAIL FROM", "RCPT TO")):
                    app_layer_proto = "SMTP"
                    payload_summary = raw_data.split("\r\n")[:5]
                else:
                    payload_summary = raw_data[:100]  # store first 100 chars as fallback
            else:
                payload_summary = None

        elif UDP in packet:
            sport = packet[UDP].sport
            dport = packet[UDP].dport
            if DNS in packet:
                app_layer_proto = "DNS"
                dns_layer = packet[DNS]
                payload_summary = {
                    "query_name": dns_layer.qd.qname.decode() if dns_layer.qd else None,
                    "query_type": dns_layer.qd.qtype if dns_layer.qd else None,
                    "rcode": dns_layer.rcode
                }

        # Map common ports if app_layer_proto not detected
        if app_layer_proto == "Unknown":
            if sport in COMMON_PORTS:
                app_layer_proto = COMMON_PORTS[sport]
            elif dport in COMMON_PORTS:
                app_layer_proto = COMMON_PORTS[dport]

        # Prepare data
        data = {
            "src_ip": packet[IP].src,
            "dest_ip": packet[IP].dst,
            "protocol": transport_proto,
            "app_layer": app_layer_proto,
            "payload_summary": payload_summary
        }

        serializer = PacketSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            saved_data.append(serializer.data)

    return Response(saved_data)
