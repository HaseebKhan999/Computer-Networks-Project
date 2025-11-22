from rest_framework.decorators import api_view
from rest_framework.response import Response
from scapy.all import sniff,IP,TCP,UDP,DNS
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
        sport = dport = None

        # Extract ports and payload if TCP/UDP
        if TCP in packet:
            sport = packet[TCP].sport
            dport = packet[TCP].dport
            payload = str(packet[TCP].payload)
        elif UDP in packet:
            sport = packet[UDP].sport
            dport = packet[UDP].dport
            payload = str(packet[UDP].payload)
        else:
            payload = ""

        # 1. Direct common ports mapping
        if sport in COMMON_PORTS:
            app_layer_proto = COMMON_PORTS[sport]
        elif dport in COMMON_PORTS:
            app_layer_proto = COMMON_PORTS[dport]
        else:
            # 2. Ephemeral port heuristic for HTTP/HTTPS
            if 80 in (sport, dport):
                app_layer_proto = "HTTP"
            elif 443 in (sport, dport):
                app_layer_proto = "HTTPS"
            # 3. DNS detection
            elif UDP in packet and 53 in (sport, dport):
                app_layer_proto = "DNS"
            # 4. HTTP payload inspection (for non-standard ports)
            elif "HTTP" in payload or payload.startswith("GET") or payload.startswith("POST"):
                app_layer_proto = "HTTP"

        # Prepare data
        data = {
            "src_ip": packet[IP].src,
            "dest_ip": packet[IP].dst,
            "protocol": transport_proto,
            "app_layer": app_layer_proto,
        }

        serializer = PacketSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            saved_data.append(serializer.data)

    return Response(saved_data)