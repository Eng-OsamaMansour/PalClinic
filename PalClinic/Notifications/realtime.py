from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializer

def push_notification(notification):
    data = NotificationSerializer(notification).data
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{notification.recipient_id}",
        {"type": "send_notification", "data": data},
    )