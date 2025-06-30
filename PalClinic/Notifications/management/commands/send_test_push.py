# Notifications/management/commands/send_test_push.py
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

from Notifications.models import Notifications
from Notifications.tasks import send_mobile_push


class Command(BaseCommand):
    help = "Create a dummy Notification for <user_id> and push it to the user’s device(s)."

    def add_arguments(self, parser):
        parser.add_argument(
            "user_id",
            type=int,
            help="Primary-key of the User who should receive the test push",
        )
        parser.add_argument(
            "body",
            nargs="?",
            default="Ping from backend ✅",
            help="Body / verb of the notification (default: 'Ping from backend ✅')",
        )

    def handle(self, user_id: int, body: str, *args, **kwargs):
        User = get_user_model()
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise CommandError(f"User {user_id} does not exist")

        # create a minimal notification row
        n = Notifications.objects.create(
            recipient=user,
            actor=user,
            verb=body,
            payload={},      # add extra data here if you like
        )

        # enqueue Celery push task
        send_mobile_push.delay(str(n.id))

        self.stdout.write(
            self.style.SUCCESS(
                f"Queued push notification {n.id} → user {user_id}"
            )
        )
