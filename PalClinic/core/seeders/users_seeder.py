"""
Seed the Users table with Arabic‐language test accounts.

Roles covered
─────────────
admin
doctor
patient
clinic_moderator
healthcarecenter_moderator

assistant role intentionally NOT created.
"""
from typing import List, Dict
import csv, os, random
from pathlib import Path

from faker import Faker
from django.conf import settings
from Users.models import User

faker = Faker("ar_PS")      # Palestinian Arabic names/addresses
faker.seed_instance(42)

# ────────────────────────────────────────────────────────────
#  CONFIGURE DEFAULT COUNTS + PASSWORDS
# ------------------------------------------------------------------
DEFAULT_COUNTS: Dict[str, int] = {
    "admin":                         1,     # superuser            (pwd: admin123)
    "doctor":                      300,     # pwd: doctor123
    "patient":                    1000,     # pwd: patient123
    "clinic_moderator":             60,     # pwd: mod123
    "healthcarecenter_moderator":   30,     # pwd: mod123
}

PASSWORDS: Dict[str, str] = {
    "admin":                         "admin123",
    "doctor":                        "doctor123",
    "patient":                       "patient123",
    "clinic_moderator":              "mod123",
    "healthcarecenter_moderator":    "mod123",
}
# assistant role omitted on purpose
# ------------------------------------------------------------------


# PUBLIC API ---------------------------------------------------------
def run(counts: Dict[str, int] | None = None) -> List[User]:
    """
    Create users per-role.  Returns the list of created User objects.

    Example
    -------
    run()                               # uses DEFAULT_COUNTS
    run({"doctor": 50, "patient": 200}) # override some numbers
    """
    if counts is None:
        counts = DEFAULT_COUNTS

    created: list[User] = []

    # -- admins ------------------------------------------------------
    created += _create_admins(counts.get("admin", 0))

    # -- all other roles --------------------------------------------
    for role in ("doctor", "patient", "clinic_moderator",
                 "healthcarecenter_moderator"):
        qty = counts.get(role, 0)
        if qty:
            created += _bulk_generic(role, qty, PASSWORDS[role])

    # dump CSV for easy testing
    _dump_credentials_csv(created)

    return created


# PRIVATE HELPERS ----------------------------------------------------
def _create_admins(n: int) -> list[User]:
    """
    Superusers MUST be created with `create_superuser` so they have
    is_staff / is_superuser flags.
    """
    users = []
    if n <= 0:
        return users

    # create the first admin with deterministic credentials
    first_admin_email = "admin@palclinic.ps"
    if not User.objects.filter(email=first_admin_email).exists():
        admin = User.objects.create_superuser(
            email=first_admin_email,
            password=PASSWORDS["admin"],
            name="المشرف العام",
            phoneNumber=faker.phone_number(),
        )
        admin._plaintext_pwd = PASSWORDS["admin"]
        users.append(admin)
        n -= 1

    # any additional admins (rare)
    for _ in range(n):
        email = faker.unique.email()
        u = User.objects.create_superuser(
            email=email,
            password=PASSWORDS["admin"],
            name=faker.name(),
            phoneNumber=faker.phone_number(),
        )
        u._plaintext_pwd = PASSWORDS["admin"]
        users.append(u)
    return users


def _bulk_generic(role: str, qty: int, pwd: str) -> list[User]:
    """
    Fast creation via bulk_create + manual password hashing.
    """
    objs = [
        User(
            email=faker.unique.email(),
            name=faker.name(),
            role=role,
            phoneNumber=faker.phone_number(),
        )
        for _ in range(qty)
    ]

    created = User.objects.bulk_create(objs, batch_size=1000)

    # hash passwords & keep plaintext on obj for CSV
    for u in created:
        u.set_password(pwd)
        u._plaintext_pwd = pwd
    # bulk_update only password hashes
    User.objects.bulk_update(created, ["password"], batch_size=1000)
    return created


def _dump_credentials_csv(users: list[User]) -> None:
    """Write a CSV in project root: users_credentials.csv"""
    fn = Path(settings.BASE_DIR) / "users_credentials.csv"
    with fn.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["email", "role", "password"])
        for u in users:
            writer.writerow([u.email, u.role, getattr(u, "_plaintext_pwd", "-")])
    print(f"📝  Credentials dumped → {fn}")
