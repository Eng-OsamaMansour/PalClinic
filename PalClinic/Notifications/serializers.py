from rest_framework import serializers
from .models import Notifications, DeviceToken

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notifications
        fields = "__all__"

class DeviceTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DeviceToken
        fields = ["id", "token", "platform"]