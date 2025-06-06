# notifications/signals.py
from django.db import models
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from Appointment.models import Appointment
from .models import Notifications
from .realtime import push_notification
from .tasks import send_mobile_push
from Users.models import User
from AccessControl.models import AssignClinicModerators

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Appointment)
def appointment_created(sender, instance, created, **kwargs):
    if not created:
        return
    logger.info(f"⚡ appointment_created signal for Appointment {instance.id}")
    moderator = AssignClinicModerators.objects.get(clinic_id = instance.clinic).moderator
    notification = Notifications.objects.create(
        recipient = moderator,
        actor     = moderator,
        verb      = "added appointment",
        target    = instance,
        payload   = {"appointment_id": instance.id}
    )
    push_notification(notification)          # Web
    send_mobile_push.delay(str(notification.id))  # Mobile
