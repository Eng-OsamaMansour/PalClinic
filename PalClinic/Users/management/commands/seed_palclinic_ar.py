import csv, os, random, string, datetime
from collections import defaultdict

from django.conf import settings
from django.contrib.gis.geos import Point
from django.core.management.base import BaseCommand
from django.db import transaction
from faker import Faker

# --- your own apps ---
from Users.models import User
from Clinic.models import Clinic
from HealthCareCenter.models import HealthCareCenter
from AccessControl.models import (
    AssignDoctorToClinic,
    AssignClinicModerators,
    AssignedHealthCareCenterModerators,
    AssignClinicToHealthCareCenter,          # NEW
)
from MedicalProfile.models import (
    MedicalProfile, BasicInfo, Surgery, LabTest,
    Treatment, DoctorNote
)
from Appointment.models import Appointment, AppointmentBooking
from Chat.models import Room, Message                         # adjust app label if different
from Notifications.models import Notifications, DeviceToken   # DeviceToken imported here
from Sharing.models import DoctorAccessRequest                # adjust path if different
from Reviews.models import Review                             # adjust path if different

faker = Faker("ar_PS")
Faker.seed(42)

# ------- static arabic lists -------
SURGERIES = ["استئصال الزائدة", "قسطرة قلبية", "جراحة قلب مفتوح"]
LAB_TESTS = ["تحليل دم شامل", "أشعة مقطعية", "تحليل وظائف كبد"]
DRUGS     = ["أموكسيسيلين 500 ملغ", "باراسيتامول 1 غ", "إنسولين سريع"]
RATINGS   = [1, 2, 3, 4, 5]

def ar_text(max_chars=120):
    return faker.text(max_nb_chars=max_chars)

def random_hex(n=64):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

# ────────────────────────────────────────────────────────────────
class Command(BaseCommand):
    help = "Seeds every PalClinic model (except Embedding / assistant role) with Arabic test data"

    # ------------------------------------------------------
    def add_arguments(self, parser):
        parser.add_argument("--patients", type=int, default=1500)
        parser.add_argument("--doctors",  type=int, default=400)
        parser.add_argument("--clinics",  type=int, default=60)
        parser.add_argument("--centers",  type=int, default=15)

    # ------------------------------------------------------
    @transaction.atomic
    def handle(self, *args, **opts):

        self.stdout.write(self.style.NOTICE("⏳  Seeding PalClinic …"))

        admins   = self._ensure_admin()
        doctors  = self._bulk_users("doctor",  opts["doctors"],  "doctor123")
        patients = self._bulk_users("patient", opts["patients"], "patient123")
        mods_c   = self._bulk_users("clinic_moderator",         80, "mod123")
        mods_h   = self._bulk_users("healthcarecenter_moderator",30, "mod123")

        centers  = self._create_centers(opts["centers"])
        clinics  = self._create_clinics(opts["clinics"], centers)

        self._map_clinics_to_centers(clinics, centers)
        self._assign_staff(doctors, clinics, mods_c, mods_h, centers)
        self._seed_profiles(patients, doctors)
        appts = self._seed_appointments(clinics, doctors, patients)
        self._seed_chat_and_reviews(appts)
        self._seed_doctor_access_requests(doctors, patients)
        self._seed_device_tokens(admins + doctors + patients + mods_c + mods_h)

        self._write_credentials([admins, doctors, patients, mods_c, mods_h])

        self.stdout.write(self.style.SUCCESS("✅  All data inserted & credentials dumped!"))

    # ======================================================
    # USER HELPERS
    # ======================================================
    def _ensure_admin(self):
        qs = User.objects.filter(role="admin")
        if qs.exists():
            admin = qs.first()
            admin._plaintext_pwd = "admin123"
            return admin
        admin = User.objects.create_superuser(
            email="admin@palclinic.ps",
            password="admin123",
            name="المشرف العام"
        )
        admin._plaintext_pwd = "admin123"
        return admin

    def _bulk_users(self, role, count, pwd):
        objs = User.objects.bulk_create(
            [User(email=faker.unique.email(), name=faker.name(), role=role)
             for _ in range(count)],
            batch_size=1000
        )
        for u in objs:
            u.set_password(pwd)
            u.save(update_fields=["password"])
            u._plaintext_pwd = pwd        # keep for CSV
        return objs

    # ======================================================
    # CENTERS / CLINICS
    # ======================================================
    def _create_centers(self, n):
        objs = [HealthCareCenter(
            name=faker.company(),
            centerType=random.choice(["Goverment", "Private", "Non-Profit"]),
            address=faker.address(),
            phoneNumber=faker.phone_number(),
            email=faker.unique.company_email(),
            discrption=ar_text(180),
            location=Point(float(faker.longitude()), float(faker.latitude())),
        ) for _ in range(n)]
        return HealthCareCenter.objects.bulk_create(objs, batch_size=256)

    def _create_clinics(self, n, centers):
        objs = [Clinic(
            name="عيادة " + faker.company(),
            clinictype=random.choice(["individual", "healthcarecenter"]),
            address=faker.address(),
            phoneNumber=faker.phone_number(),
            email=faker.unique.company_email(),
            specialties="، ".join(faker.words(3)),
            operating_hours={"السبت": "08-17", "الأحد": "08-17"},
            location=Point(float(faker.longitude()), float(faker.latitude())),
        ) for _ in range(n)]
        return Clinic.objects.bulk_create(objs, batch_size=256)

    def _map_clinics_to_centers(self, clinics, centers):
        """Create AssignClinicToHealthCareCenter entries for 70 % of clinics."""
        links = []
        for cl in clinics:
            if cl.clinictype == "healthcarecenter" or random.random() < 0.7:
                hc = random.choice(centers)
                links.append(AssignClinicToHealthCareCenter(
                    clinic=cl, health=hc, is_active=True
                ))
        AssignClinicToHealthCareCenter.objects.bulk_create(links, batch_size=1000)

    # ======================================================
    # STAFF & PERMISSIONS
    # ======================================================
    def _assign_staff(self, doctors, clinics, mods_c, mods_h, centers):
        # doctors ↔ clinics
        AssignDoctorToClinic.objects.bulk_create([
            AssignDoctorToClinic(doctor=d, clinic=random.choice(clinics))
            for d in doctors
            for _ in range(random.randint(1, 3))
        ], batch_size=1000)

        # clinic moderators
        AssignClinicModerators.objects.bulk_create([
            AssignClinicModerators(
                clinic=cl,
                moderator=random.choice(mods_c),
                is_active=True
            )
            for cl in clinics
        ], batch_size=1000)

        # centre moderators
        AssignedHealthCareCenterModerators.objects.bulk_create([
            AssignedHealthCareCenterModerators(
                healthcarecenter=cen,
                moderator=random.choice(mods_h),
                is_active=True
            )
            for cen in centers
        ], batch_size=1000)

    # ======================================================
    # MEDICAL PROFILES
    # ======================================================
    def _seed_profiles(self, patients, doctors):
        profiles = MedicalProfile.objects.bulk_create(
            [MedicalProfile(patient=p) for p in patients], batch_size=1000
        )

        bulk = defaultdict(list)
        today = datetime.date.today()

        for pf in profiles:
            bulk[BasicInfo].append(BasicInfo(
                medical_profile=pf,
                age=random.randint(1, 90),
                gender=random.choice(["ذكر", "أنثى"]),
                height=round(random.uniform(1.4, 1.9), 2),
                weight=round(random.uniform(40, 110), 1),
                blood_type=random.choice(["A+", "A-", "B+", "B-", "O+", "O-"]),
                allergies=ar_text(80),
                chronic_conditions=ar_text(80),
            ))

            for _ in range(random.randint(0, 2)):
                bulk[Surgery].append(Surgery(
                    medical_profile=pf,
                    doctor=random.choice(doctors),
                    surgery_type=random.choice(SURGERIES),
                    description=ar_text(),
                    report="files/surgery_reports/demo.pdf",
                    surgery_date=today - datetime.timedelta(days=random.randint(30, 730)),
                ))

            for _ in range(random.randint(1, 3)):
                bulk[LabTest].append(LabTest(
                    medical_profile=pf,
                    name=random.choice(LAB_TESTS),
                    description=ar_text(),
                    results="files/lab_results/demo.pdf",
                ))

            for _ in range(random.randint(1, 4)):
                bulk[Treatment].append(Treatment(
                    medical_profile=pf,
                    doctor=random.choice(doctors),
                    treatment=random.choice(DRUGS),
                    dosage="مرتين يوميًا",
                    description=ar_text(60),
                    start_date=today - datetime.timedelta(days=30),
                    end_date=today + datetime.timedelta(days=30),
                    active=True,
                ))

            bulk[DoctorNote].append(DoctorNote(
                medical_profile=pf,
                doctor=random.choice(doctors),
                title="ملاحظة طبية",
                note=ar_text(120),
            ))

        # bulk insert per model
        for mdl, objs in bulk.items():
            mdl.objects.bulk_create(objs, batch_size=1000)

    # ======================================================
    # APPOINTMENTS, BOOKINGS, NOTIFICATIONS
    # ======================================================
    def _seed_appointments(self, clinics, doctors, patients):
        slots, bookings, notices = [], [], []
        today = datetime.date.today()

        for cl in clinics:
            for i in range(14):
                d = today + datetime.timedelta(days=i)
                for hr in [9, 11, 13, 15]:
                    slots.append(Appointment(
                        clinic=cl,
                        doctor=random.choice(doctors),
                        date=d,
                        time=datetime.time(hr, 0),
                        available=True
                    ))

        slots = Appointment.objects.bulk_create(slots, batch_size=1000)

        # ⅓ booked
        for appt in random.sample(slots, k=len(slots)//3):
            appt.available = False
            appt.save(update_fields=["available"])

            patient = random.choice(patients)
            bookings.append(AppointmentBooking(
                appointment=appt, patient=patient
            ))

            notices.append(Notifications(
                actor=patient,
                recipient=appt.doctor,
                verb="حجز موعد",
                target=appt,
                unread=True
            ))

        AppointmentBooking.objects.bulk_create(bookings, batch_size=1000)
        Notifications.objects.bulk_create(notices, batch_size=1000)
        return bookings   # we’ll use bookings to create chats & reviews

    # ======================================================
    # CHATS & REVIEWS
    # ======================================================
    def _seed_chat_and_reviews(self, bookings):
        rooms, messages, reviews = [], [], []

        for bk in bookings:
            # ----- chat room -----
            room = Room(name=f"room#{bk.appointment.id}")
            rooms.append(room)

        rooms = Room.objects.bulk_create(rooms, batch_size=1000)
        room_map = {r.name: r for r in rooms}

        # two messages per room
        for bk in bookings:
            r = room_map[f"room#{bk.appointment.id}"]
            messages.extend([
                Message(room=r,
                        author=bk.patient,
                        body="مرحبًا دكتور، أشكرك على وقتك."),
                Message(room=r,
                        author=bk.appointment.doctor,
                        body="أهلًا، سأكون في خدمتك في الموعد المحدد.")
            ])

            # ----- review after appointment -----
            if random.random() < 0.5:
                reviews.append(Review(
                    clinic=bk.appointment.clinic,
                    patient=bk.patient,
                    rating=random.choice(RATINGS),
                    comment=ar_text(80)
                ))

        Message.objects.bulk_create(messages, batch_size=1000)
        Review.objects.bulk_create(reviews,   batch_size=1000)

    # ======================================================
    # ACCESS REQUESTS
    # ======================================================
    def _seed_doctor_access_requests(self, doctors, patients):
        reqs = []
        for _ in range(len(doctors)):
            reqs.append(DoctorAccessRequest(
                doctor=random.choice(doctors),
                patient=random.choice(patients),
                status=random.choice(["pending", "accepted", "rejected"])
            ))
        DoctorAccessRequest.objects.bulk_create(reqs, batch_size=1000)

    # ======================================================
    # DEVICE TOKENS
    # ======================================================
    def _seed_device_tokens(self, users):
        tokens = []
        for user in users:
            tokens.append(DeviceToken(
                owner=user,
                token=random_hex(128),
                platform=random.choice(["android", "ios", "web"])
            ))
        DeviceToken.objects.bulk_create(tokens, batch_size=1000)

    # ======================================================
    # CSV OUTPUT
    # ======================================================
    def _write_credentials(self, groups):
        path = os.path.join(settings.BASE_DIR, "users_credentials.csv")
        with open(path, "w", newline="", encoding="utf-8") as fh:
            wr = csv.writer(fh)
            wr.writerow(["email", "role", "password"])
            for grp in groups:
                for u in grp:
                    wr.writerow([u.email, u.role, getattr(u, "_plaintext_pwd", "admin123")])
        self.stdout.write(self.style.WARNING(f"📝  Credentials saved → {path}"))
