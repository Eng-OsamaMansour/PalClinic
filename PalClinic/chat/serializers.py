from rest_framework import serializers
from .models import Room, Message

class RoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = ["id", "name", "last_message"]
        read_only_fields = ["id"]

    def get_last_message(self, obj):
        message = obj.messages.last()
        return MessageSerializer(message).data if message else None


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "room", "author", "body", "created_at"]
        read_only_fields = ["id", "created_at"]
