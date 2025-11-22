from rest_framework import serializers
from .models import Packet
from django.utils.timezone import localtime
from zoneinfo import ZoneInfo

class PacketSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = Packet
        fields = ['timestamp', 'src_ip', 'dest_ip', 'protocol', 'time','app_layer']
        read_only_fields = ['timestamp']

    def get_time(self, obj):
        # Convert timestamp to Asia/Karachi (GMT+5)
        tz = ZoneInfo("Asia/Karachi")
        local_timestamp = obj.timestamp.astimezone(tz)
        return local_timestamp.strftime("%H:%M:%S")
