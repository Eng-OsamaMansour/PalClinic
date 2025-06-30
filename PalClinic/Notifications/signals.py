import logging
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch      import receiver
from django.utils.text    import slugify
from Appointment.models   import Appointment, AppointmentBooking
from AccessControl.models import AssignClinicModerators, DoctorAccessRequest
from chat.models          import Message, Room
from .models   import Notifications
from .realtime import push_notification
from .tasks    import send_mobile_push

log = logging.getLogger(__name__)

@receiver(post_save, sender=Appointment)
def appointment_created(sender, instance, created, **kwargs):
    if not created:
        return

    moderator = AssignClinicModerators.objects.get(clinic_id=instance.clinic).moderator
    notif = Notifications.objects.create(
        recipient=moderator,
        actor=moderator,
        verb="added appointment",
        target=instance,
        payload={"appointment_id": instance.id},
    )

    transaction.on_commit(
        lambda: (
            push_notification(notif),
            send_mobile_push.delay(str(notif.id)),
        )
    )

@receiver(post_save, sender=AppointmentBooking)
def appointment_booking_created(sender, instance, created, **kwargs):
    if not created:
        return

    patient = instance.patient
    doctor  = instance.appointment.doctor
    clinic  = instance.appointment.clinic

    notif = Notifications.objects.create(
        recipient=patient,
        actor=doctor,
        verb="تم حجز الموعد",
        target=instance,
        payload={
            "التاريخ": instance.appointment.date.isoformat(),
            "الوقت":   instance.appointment.time.strftime("%H:%M"),
            "العيادة": clinic.name,
        },
    )
    title     = f"{patient.name} + {doctor.name}"
    slug      = slugify(title) or f"room-{patient.id}-{doctor.id}"
    room, _   = Room.objects.get_or_create(name=slug, defaults={"title": title})
    room.participants.set([patient, doctor])

    dar, created_dar = DoctorAccessRequest.objects.get_or_create(
        patient=patient,
        doctor=doctor,
        defaults={
            "status":    DoctorAccessRequest.StatusChoices.ACCEPTED,
            "is_active": True,
        },
    )
    if not created_dar and (
        dar.status != DoctorAccessRequest.StatusChoices.ACCEPTED or not dar.is_active
    ):
        dar.status, dar.is_active = (
            DoctorAccessRequest.StatusChoices.ACCEPTED,
            True,
        )
        dar.save()
    transaction.on_commit(
        lambda: (
            push_notification(notif),
            send_mobile_push.delay(str(notif.id)),
        )
    )

    log.info("Booking OK → notif %s, room %s, DAR %s", notif.id, room.id, dar.id)
@receiver(post_save, sender=Message)
def message_created(sender, instance: Message, created: bool, **kwargs):
    if not created or instance.author.role == "assistant":
        return
    room = instance.room
    author= instance.author
    recipients = room.participants.exclude(pk=author.pk)
    for user in recipients:
        if not user.role=="assistant":
            notification = Notifications.objects.create(
                recipient = user,
                actor = author,                
                verb = "رسالة جديدة",
                target = instance,              
                payload  = {
                    "room_name":  room.name,
                    "message": instance.body,
                },
            )
            push_notification(notification)
            send_mobile_push.delay(str(notification.id))

