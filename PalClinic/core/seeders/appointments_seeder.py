"""
Arabic-ready Appointment seeder
───────────────────────────────
• Generates 14 days × 4 slots/day × N clinics
• Randomly books ~⅓ with patients
• Dumps CSVs: appointments.csv and appointment_bookings.csv
"""

import random, csv, datetime
from pathlib import Path
from typing import List, Dict

from django.conf import settings
from django.db import transaction
from django.contrib.auth import get_user_model

from Clinic.models import Clinic
from Appointment.models import Appointment, AppointmentBooking
from AccessControl.models import AssignDoctorToClinic

User = get_user_model()

# ------------------------------------------------------------------
TIME_SLOTS = [datetime.time(9, 0), datetime.time(11, 0),
              datetime.time(13, 0), datetime.time(15, 0)]
DAYS_AHEAD = 14


# ──────────────────────────────────────────────────────────────
@transaction.atomic
def run(**_) -> Dict[str, int]:
    """
    Create appointment slots & bookings. Returns dict with counts.
    """
    doctors  = list(User.objects.filter(role="doctor"))
    patients = list(User.objects.filter(role="patient"))
    clinics  = list(Clinic.objects.all())

    if not (doctors and patients and clinics):
        raise RuntimeError("Need doctors, patients, and clinics seeded first.")

    # helper: map clinic → list[doctor] (if AssignDoctorToClinic exists)
    try:
        relations = AssignDoctorToClinic.objects.filter(is_active=True)
        doc_map = {}
        for rel in relations:
            doc_map.setdefault(rel.clinic_id, []).append(rel.doctor)
    except Exception:
        doc_map = {}

    today = datetime.date.today()
    slots: List[Appointment] = []

    # --- create raw appointment objects -----------------------
    for cl in clinics:
        for day_offset in range(DAYS_AHEAD):
            d = today + datetime.timedelta(days=day_offset)
            for t in TIME_SLOTS:
                # prefer doctors assigned to this clinic; else any doctor
                doc_pool = doc_map.get(cl.id, doctors)
                slots.append(Appointment(
                    date=d,
                    time=t,
                    clinic=cl,
                    doctor=random.choice(doc_pool),
                    status=Appointment.Status.PENDING,
                    available=True
                ))

    appointments = Appointment.objects.bulk_create(slots, batch_size=1000)

    # --- randomly book ~⅓ of them -----------------------------
    to_book = random.sample(appointments, k=len(appointments) // 3)
    bookings: List[AppointmentBooking] = []
    for appt in to_book:
        appt.available = False
        appt.status    = Appointment.Status.PENDING   # still pending
        patient        = random.choice(patients)
        bookings.append(AppointmentBooking(
            appointment=appt,
            patient=patient
        ))

    Appointment.objects.bulk_update(to_book, ["available", "status"])
    AppointmentBooking.objects.bulk_create(bookings, batch_size=1000)

    # --- CSV exports ------------------------------------------
    _dump_appointments_csv(appointments)
    _dump_bookings_csv(bookings)

    counts = {
        "appointments": len(appointments),
        "bookings":     len(bookings),
    }
    print("✅ Appointments seeding done →", counts)
    return counts


# ---------------- CSV helpers --------------------------------
def _dump_appointments_csv(appts: List[Appointment]) -> None:
    path = Path(settings.BASE_DIR) / "appointments.csv"
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["id", "clinic_id", "doctor_id", "date",
                    "time", "status", "available"])
        for a in appts:
            w.writerow([a.id, a.clinic_id, a.doctor_id,
                        a.date.isoformat(), a.time.isoformat(),
                        a.status, a.available])
    print(f"📄  appointments.csv saved → {path}")


def _dump_bookings_csv(bks: List[AppointmentBooking]) -> None:
    path = Path(settings.BASE_DIR) / "appointment_bookings.csv"
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["id", "appointment_id", "patient_id"])
        for b in bks:
            w.writerow([b.id, b.appointment_id, b.patient_id])
    print(f"📄  appointment_bookings.csv saved → {path}")
