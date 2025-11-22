from django.contrib import admin
from django.urls import path
from .views import getRecentPackets,getPackets,noPackets
urlpatterns = [
    path('api/packets/recent/',getRecentPackets),
    path('api/packets/',getPackets),
    path('api/numberOfPackets/',noPackets)
]