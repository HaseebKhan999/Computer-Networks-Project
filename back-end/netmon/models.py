from django.db import models

# Create your models here.
class Packet(models.Model):
    timestamp=models.DateTimeField(auto_now_add=True)
    src_ip=models.GenericIPAddressField()
    dest_ip=models.GenericIPAddressField()
    protocol=models.CharField(max_length=10)
    payload_summary = models.JSONField(blank=True, null=True)
    app_layer=models.CharField(max_length=50, blank=True, null=True)

