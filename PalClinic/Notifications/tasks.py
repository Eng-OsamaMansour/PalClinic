from celery import shared_task
from django.conf import settings
from pyfcm import FCMNotification
from .models import Notifications, DeviceToken

@shared_task
def send_mobile_push(notification_id):
    n = Notifications.objects.get(pk=notification_id)
    tokens = list(DeviceToken.objects.filter(owner=n.recipient).values_list("token", flat=True))
    if not tokens:
        return
    fcm = FCMNotification(api_key=settings.FCM_SERVER_KEY)
    fcm.notify_multiple_devices(
        registration_ids=tokens,
        message_title="PalClinic",
        message_body=n.verb,
        data_message={"payload": n.payload},
    )