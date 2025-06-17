# export_patient_doctor_csv.py
import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.timezone import now

from chat.models import Room, Message          # adjust if your app name differs
from Users.models import User                  # contains role field


class Command(BaseCommand):
    """
    Export all chat rooms to patient_doctor.csv
    -------------------------------------------
    • Each row has 2 columns: patient, doctor
    • Consecutive patient lines are merged into one question
    • First doctor message that follows becomes the answer
    • Unanswered patient queries are still exported (doctor column empty)
    """

    help = "Export doctor–patient Q-A pairs to patient_doctor.csv"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dest",
            default="patient_doctor.csv",
            help="Output CSV filename (default: patient_doctor.csv)",
        )
        parser.add_argument(
            "--room",
            type=int,
            help="Only export a single Room ID (useful for debugging)",
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        out_path = Path(opts["dest"]).resolve()
        qs = Room.objects.all()
        if opts.get("room"):
            qs = qs.filter(pk=opts["room"])

        pair_total = 0
        with out_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Patient", "Doctor"])          # CSV header

            for room in qs.iterator():
                pt_buffer = []  # holds consecutive patient messages

                msgs = (
                    Message.objects.filter(room=room)
                    .select_related("author")
                    .order_by("created_at")
                )

                for msg in msgs:
                    role = getattr(msg.author, "role", "").lower()

                    # accumulate patient lines
                    if role == "patient":
                        pt_buffer.append(msg.body.strip())
                        continue

                    # role == doctor → flush a pair
                    if role == "doctor":
                        if pt_buffer:
                            writer.writerow([" ".join(pt_buffer), msg.body.strip()])
                            pair_total += 1
                            pt_buffer.clear()
                        # if no pending patient text → skip doctor message

                # leftover patient text (no doctor reply yet)
                if pt_buffer:
                    writer.writerow([" ".join(pt_buffer), ""])
                    pair_total += 1

        self.stdout.write(
            self.style.SUCCESS(f"✅  Wrote {pair_total} rows → {out_path}")
        )
