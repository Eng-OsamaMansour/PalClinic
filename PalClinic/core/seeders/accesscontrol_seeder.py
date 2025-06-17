"""
Access-Control seeder
─────────────────────
Populates:
  • AssignClinicToHealthCenter
  • AssignClinicModerators
  • AssignedHealthCareCenterModerators
  • AssignDoctorToClinic
  • DoctorAccessRequest
Assumes Users, Clinics, and HealthCareCenters are already seeded.
"""

import random
from typing import Dict, List

from Users.models import User
from Clinic.models import Clinic
from HealthCareCenter.models import HealthCareCenter
from AccessControl.models import (
    AssignClinicToHealthCenter,
    AssignClinicModerators,
    AssignedHealthCareCenterModerators,
    AssignDoctorToClinic,
    DoctorAccessRequest,
)


def run(**_) -> Dict[str, int]:
    """Create relations, return dict with counts per model."""
    doctors      = list(User.objects.filter(role="doctor"))
    patients     = list(User.objects.filter(role="patient"))
    clinic_mods  = list(User.objects.filter(role="clinic_moderator"))
    center_mods  = list(User.objects.filter(role="healthcarecenter_moderator"))

    clinics      = list(Clinic.objects.all())
    centers      = list(HealthCareCenter.objects.all())
    hc_clinics   = [c for c in clinics
                    if c.clinictype == Clinic.ClinicType.HCCR]

    counts: Dict[str, int] = {}

    # ── 1. Clinic → Health-Care Center (only for hc-type clinics) ──
    acth_objs: List[AssignClinicToHealthCenter] = []
    for cl in hc_clinics:
        acth_objs.append(
            AssignClinicToHealthCenter(
                clinic=cl,
                health=random.choice(centers),
                is_active=True,
            )
        )
    AssignClinicToHealthCenter.objects.all().delete()  # reset first
    AssignClinicToHealthCenter.objects.bulk_create(acth_objs, batch_size=256)
    counts["AssignClinicToHealthCenter"] = len(acth_objs)

    # ── 2. Clinic moderators ──
    acm_objs: List[AssignClinicModerators] = []
    mod_iter = _round_robin(clinic_mods, len(clinics))
    for cl in clinics:
        acm_objs.append(
            AssignClinicModerators(
                clinic=cl,
                moderator=next(mod_iter),
                is_active=True
            )
        )
    AssignClinicModerators.objects.all().delete()
    AssignClinicModerators.objects.bulk_create(acm_objs, batch_size=256)
    counts["AssignClinicModerators"] = len(acm_objs)

    # ── 3. Health-Care Center moderators ──
    ahcm_objs: List[AssignedHealthCareCenterModerators] = []
    cmod_iter = _round_robin(center_mods, len(centers))
    for cen in centers:
        ahcm_objs.append(
            AssignedHealthCareCenterModerators(
                healthcarecenter=cen,
                moderator=next(cmod_iter),
                is_active=True
            )
        )
    AssignedHealthCareCenterModerators.objects.all().delete()
    AssignedHealthCareCenterModerators.objects.bulk_create(ahcm_objs, batch_size=128)
    counts["AssignedHealthCareCenterModerators"] = len(ahcm_objs)

    # ── 4. Doctor → Clinics (1-3 each) ──
    adtc_objs: List[AssignDoctorToClinic] = []
    for d in doctors:
        for cl in random.sample(clinics, k=random.randint(1, 3)):
            adtc_objs.append(
                AssignDoctorToClinic(
                    doctor=d,
                    clinic=cl,
                    is_active=True
                )
            )
    AssignDoctorToClinic.objects.all().delete()
    AssignDoctorToClinic.objects.bulk_create(adtc_objs, batch_size=512)
    counts["AssignDoctorToClinic"] = len(adtc_objs)

    # ── 5. DoctorAccessRequest  (random patient ↔ doctor) ──
    statuses = [
        DoctorAccessRequest.StatusChoices.PENDING,
        DoctorAccessRequest.StatusChoices.ACCEPTED,
        DoctorAccessRequest.StatusChoices.REJECTED,
    ]
    dar_objs: List[DoctorAccessRequest] = []
    for _ in range(max(len(doctors), len(patients))):
        patient = random.choice(patients)
        doctor  = random.choice(doctors)
        dar_objs.append(
            DoctorAccessRequest(
                patient=patient,
                doctor=doctor,
                status=random.choice(statuses),
                is_active=True
            )
        )
    DoctorAccessRequest.objects.all().delete()
    DoctorAccessRequest.objects.bulk_create(dar_objs, batch_size=512)
    counts["DoctorAccessRequest"] = len(dar_objs)

    print("✅ Access-control relations created:", counts)
    return counts


# ---------- utility -------------------------------------------------
def _round_robin(items: List, needed: int):
    """
    Yield items endlessly so every target gets a moderator.
    """
    idx = 0
    n   = len(items)
    while True:
        yield items[idx % n]
        idx += 1
        if idx >= needed and idx % n == 0:
            break
