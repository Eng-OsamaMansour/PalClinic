from celery import shared_task
from asgiref.sync import async_to_sync
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Notifications, DeviceToken
from .serializers import NotificationSerializer
from channels.layers import get_channel_layer
import httpx
import math
import logging

logger = logging.getLogger(__name__)

EXPO_URL = "https://exp.host/--/api/v2/push/send"
BATCH = 100

def _chunk(lst, size):
    for i in range(0, len(lst), size):
        yield lst[i : i + size]

@shared_task
def send_mobile_push(notification_id: str):
    notif = Notifications.objects.select_related("recipient").get(pk=notification_id)

    tokens = list(
        DeviceToken.objects
        .filter(owner=notif.recipient)
        .values_list("token", flat=True)
    )
    if not tokens:
        logger.info("No device tokens for user %s – skipping push", notif.recipient_id)
        return

    payload_template = {
        "title": "PalClinic",
        "body": notif.verb,
        "data": {"payload": notif.payload},
        "sound": "default",
        "channelId": "default",   
    }

    with httpx.Client(timeout=10) as client:
        for chunk in _chunk(tokens, BATCH):
            body = [{**payload_template, "to": t} for t in chunk]
            r = client.post(EXPO_URL, json=body)
            try:
                r.raise_for_status()
                logger.info("Expo ticket OK for notif %s → %d devices", notification_id, len(chunk))
            except httpx.HTTPStatusError as exc:
                logger.error("Expo ticket failed (%s): %s", exc.response.status_code, exc.response.text)

    # (The websocket broadcast you already had stays unchanged)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"room_{notif.recipient_id}",
        {"type": "send_notification",
         "data": NotificationSerializer(notif).data}
    )