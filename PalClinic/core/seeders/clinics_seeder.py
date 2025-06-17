"""
Arabic Clinic seeder
────────────────────
• 60 rows (30 individual, 30 healthcarecenter)
• Arabic text only
• CSV dump: clinics.csv
"""
from typing import List
import random, csv
from pathlib import Path
from faker import Faker
from django.conf import settings
from django.contrib.gis.geos import Point
from Clinic.models import Clinic         # adjust import if app label differs

faker = Faker("ar_PS")
faker.seed_instance(42)

# Arabic parts for names / specialties
NAME_PREFIXES = ["عيادة"]
NAME_SUFFIXES = ["الشفاء", "البسمة", "الرعاية", "الهدى",
                 "القدس", "الأمل", "الأقصى", "السلام"]

SPECIALTIES = [
    "طب أسنان", "طب عام", "أطفال", "باطني", "عظام",
    "جلدية", "عيون", "نساء وتوليد", "أنف وأذن وحنجرة", "قلب"
]

# Palestine bounding box for random points
LON_MIN, LON_MAX = 34.2, 35.6
LAT_MIN, LAT_MAX = 31.2, 32.5


# ──────────────────────────────────────────────────────────────
def run(total: int = 60, **_) -> List[Clinic]:
    """
    Create 60 clinics (30 INDV + 30 HCCR) and dump to CSV.
    """
    if total < 60:
        raise ValueError("Need at least 60 rows to keep 30 of each type")

    objs, used_names, used_emails = [], set(), set()
    half = total // 2

    for idx in range(total):
        ctype = (Clinic.ClinicType.INDV
                 if idx < half
                 else Clinic.ClinicType.CHAR)

        name = _unique_name(used_names, idx)
        email = _unique_email(used_emails)

        objs.append(
            Clinic(
                name=name,
                clinictype=ctype,
                address=faker.address(),
                phoneNumber=faker.phone_number(),
                email=email,
                location=_random_point(),
                specialties=_random_specialties(),
                operating_hours={
                    "السبت": "09-17",
                    "الأحد": "09-17",
                    "الاثنين": "09-17",
                    "الثلاثاء": "09-17",
                    "الأربعاء": "09-17",
                },
            )
        )

    objs = Clinic.objects.bulk_create(objs, batch_size=128)
    _dump_csv(objs)
    return objs


# ---------------- helpers ------------------------------------
def _unique_name(used: set[str], idx: int) -> str:
    for _ in range(10):
        name = f"{random.choice(NAME_PREFIXES)} {random.choice(NAME_SUFFIXES)}"
        if name not in used:
            used.add(name)
            return name
    # fallback with index to enforce uniqueness
    final = f"{random.choice(NAME_PREFIXES)} {random.choice(NAME_SUFFIXES)} {idx}"
    used.add(final)
    return final


def _unique_email(used: set[str]) -> str:
    while True:
        email = faker.unique.company_email()
        if email not in used:
            used.add(email)
            return email


def _random_specialties() -> str:
    # pick 2-3 unique specialties
    return "، ".join(random.sample(SPECIALTIES, k=random.randint(2, 3)))


def _random_point() -> Point:
    lng = random.uniform(LON_MIN, LON_MAX)
    lat = random.uniform(LAT_MIN, LAT_MAX)
    return Point(lng, lat, srid=4326)


def _dump_csv(objs: List[Clinic]) -> None:
    path = Path(settings.BASE_DIR) / "clinics.csv"
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow([
            "id", "name", "clinictype", "address",
            "longitude", "latitude", "phoneNumber",
            "email", "specialties"
        ])
        for c in objs:
            w.writerow([
                c.id, c.name, c.clinictype,
                c.address.replace("\n", " "),
                c.location.x if c.location else "",
                c.location.y if c.location else "",
                c.phoneNumber, c.email,
                c.specialties,
            ])
    print(f"📄  CSV saved → {path}")

