"""
Arabic Medical-Profile seeder (robust version)
──────────────────────────────────────────────
Creates full medical profiles for every patient, using direct
model queries instead of reverse-relation attributes, so it
doesn’t matter what related_name you set.
"""

import random, datetime
from typing import List
from faker import Faker

from Users.models import User
from MedicalProfile.models import (
    MedicalProfile, BasicInfo, Surgery, LabTest,
    Treatment, DoctorNote
)

faker = Faker("ar_PS")
faker.seed_instance(42)

SURGERIES = [
    "استئصال الزائدة", "قسطرة قلبية", "عملية غضروف",
    "جراحة قلب مفتوح", "استبدال مفصل ركبة", "عملية فتق"
]
LAB_TESTS = [
    "تحليل دم شامل", "أشعة مقطعية", "تحليل وظائف كبد",
    "أشعة سينية", "تحليل سكر صائم", "تحليل كوليسترول"
]
DRUGS = [
    "أموكسيسيلين 500 ملغ", "باراسيتامول 1 غ",
    "إنسولين سريع المفعول", "إيبوبروفين 400 ملغ",
    "ميتفورمين 850 ملغ"
]


def run(**_) -> List[MedicalProfile]:
    patients = list(User.objects.filter(role="patient"))
    doctors  = list(User.objects.filter(role="doctor"))
    if not doctors:
        raise RuntimeError("No doctors found – cannot attach FK relationships.")

    created_profiles = []
    today = datetime.date.today()

    for pat in patients:
        profile, created = MedicalProfile.objects.get_or_create(patient=pat)
        if created:
            created_profiles.append(profile)

        # 1- BasicInfo (1-to-1)
        if not BasicInfo.objects.filter(medical_profile=profile).exists():
            BasicInfo.objects.create(
                medical_profile=profile,
                age=random.randint(1, 90),
                gender=random.choice(["ذكر", "أنثى"]),
                height=round(random.uniform(1.4, 1.9), 2),
                weight=round(random.uniform(40, 110), 1),
                blood_type=random.choice(["A+", "A-", "B+", "B-", "O+", "O-"]),
                allergies=faker.text(max_nb_chars=80),
                chronic_conditions=faker.text(max_nb_chars=80),
            )

        # 2- Surgeries
        if not Surgery.objects.filter(medical_profile=profile).exists():
            for _ in range(random.randint(0, 2)):
                Surgery.objects.create(
                    medical_profile=profile,
                    doctor=random.choice(doctors),
                    surgery_type=random.choice(SURGERIES),
                    description=faker.text(max_nb_chars=120),
                    report="files/surgery_reports/demo.pdf",
                    surgery_date=today - datetime.timedelta(days=random.randint(30, 730)),
                )

        # 3- LabTests
        if not LabTest.objects.filter(medical_profile=profile).exists():
            for _ in range(random.randint(1, 3)):
                LabTest.objects.create(
                    medical_profile=profile,
                    name=random.choice(LAB_TESTS),
                    description=faker.text(max_nb_chars=80),
                    results="files/lab_results/demo.pdf",
                )

        # 4- Treatments
        if not Treatment.objects.filter(medical_profile=profile).exists():
            for _ in range(random.randint(1, 4)):
                Treatment.objects.create(
                    medical_profile=profile,
                    doctor=random.choice(doctors),
                    treatment=random.choice(DRUGS),
                    dosage="مرتين يوميًا",
                    description=faker.text(max_nb_chars=60),
                    start_date=today - datetime.timedelta(days=30),
                    end_date=today + datetime.timedelta(days=30),
                    active=True,
                )

        # 5- DoctorNotes
        if not DoctorNote.objects.filter(medical_profile=profile).exists():
            for _ in range(random.randint(1, 2)):
                DoctorNote.objects.create(
                    medical_profile=profile,
                    doctor=random.choice(doctors),
                    title="ملاحظة طبية",
                    note=faker.text(max_nb_chars=120),
                )

    print(f"✅ Created/updated {len(created_profiles)} medical profiles.")
    return created_profiles
