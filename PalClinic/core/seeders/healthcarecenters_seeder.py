"""
Arabic-only Health-Care Center seeder
------------------------------------
✓ Names strictly Arabic  (Hospital / Health Center / … + Arabic suffix)
✓ Descriptions strictly Arabic
✓ CSV dump: healthcare_centers.csv
"""
from typing import List
import random, csv
from pathlib import Path

from faker import Faker
from django.conf import settings
from django.contrib.gis.geos import Point
from HealthCareCenter.models import HealthCareCenter

faker = Faker("ar_PS")
faker.seed_instance(42)

PREFIXES = ["مستشفى", "مركز صحي", "مجمع طبي", "عيادة", "مستوصف"]
SUFFIXES = [
    "الشفاء", "القدس", "الأقصى", "الرحمة", "النبض", "الأمل",
    "السلام", "البسمة", "الياسمين", "الريادة", "الكرامة", "النهضة",
]

TYPE_CHOICES = [
    HealthCareCenter.TypeChoices.GOV,
    HealthCareCenter.TypeChoices.PRV,
    HealthCareCenter.TypeChoices.NP,
]


# ──────────────────────────────────────────────────────────────
def run(count: int = 30, **_) -> List[HealthCareCenter]:
    objs, used_names = [], set()

    for idx in range(count):
        name = _unique_name(used_names, idx)
        objs.append(
            HealthCareCenter(
                name=name,
                centerType=random.choice(TYPE_CHOICES),
                address=faker.address(),
                location=_random_point(),
                phoneNumber=faker.phone_number(),
                email=faker.unique.company_email(),
                discrption=faker.paragraph(nb_sentences=3),  # Arabic paragraph
            )
        )

    objs = HealthCareCenter.objects.bulk_create(objs, batch_size=128)
    _dump_csv(objs)
    return objs


# ------------------- helpers ---------------------------------
def _unique_name(used: set[str], idx: int) -> str:
    """
    Arabic name: <PREFIX> <SUFFIX>. Falls back to adding index for uniqueness.
    """
    for _ in range(10):
        name = f"{random.choice(PREFIXES)} {random.choice(SUFFIXES)}"
        if name not in used:
            used.add(name)
            return name
    # extreme fallback (very unlikely)
    name = f"{random.choice(PREFIXES)} {random.choice(SUFFIXES)} {idx}"
    used.add(name)
    return name


def _random_point() -> Point:
    lng = random.uniform(34.2, 35.6)  # Palestine bounds (approx.)
    lat = random.uniform(31.2, 32.5)
    return Point(lng, lat, srid=4326)


def _dump_csv(objs: List[HealthCareCenter]) -> None:
    path = Path(settings.BASE_DIR) / "healthcare_centers.csv"
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow([
            "id", "name", "centerType", "address",
            "longitude", "latitude", "phoneNumber",
            "email", "description"
        ])
        for c in objs:
            w.writerow([
                c.id, c.name, c.centerType,
                c.address.replace("\n", " "),
                c.location.x if c.location else "",
                c.location.y if c.location else "",
                c.phoneNumber, c.email,
                c.discrption.replace("\n", " "),
            ])
    print(f"📄  CSV saved → {path}")
