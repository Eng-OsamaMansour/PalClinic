from django.core.management.base import BaseCommand
from Users.models import User
from django.contrib.auth.hashers import make_password
import random

class Command(BaseCommand):
    help = 'Seed the database with test users (admin, doctors, patients)'

    def handle(self, *args, **kwargs):
        # Create Healthcare Center Moderators
        for i in range(1, 3):
            User.objects.create_healthcarecenter_moderator(
                email=f"healthmod{i}@palclinic.com",
                password="admin123",
                name=f"Health Mod {i}",
                phoneNumber=f"+97059200020{i}"
            )
            self.stdout.write(self.style.SUCCESS(f"🏥 Health Center Moderator {i} created."))

        # Create Clinic Moderators
        for i in range(1, 4):
            User.objects.create_clinic_moderator(
                email=f"clinicmod{i}@palclinic.com",
                password="admin123",
                name=f"Clinic Mod {i}",
                phoneNumber=f"+97059200030{i}"
            )
            self.stdout.write(self.style.SUCCESS(f"🏨 Clinic Moderator {i} created."))
        # if not User.objects.filter(email="admin@example.com").exists():
        #     User.objects.create_superuser(
        #         name="Admin User",
        #         email="admin@example.com",
        #         password="admin1234",
        #         role="admin",
        #         phoneNumber="0000000000",
        #     )
        #     self.stdout.write(self.style.SUCCESS("✅ Admin user created."))

        # # Create doctors
        # for i in range(1, 6):
        #     email = f"doctor{i}@example.com"
        #     if not User.objects.filter(email=email).exists():
        #         User.objects.create_user(
        #             name=f"Doctor {i}",
        #             email=email,
        #             password="doctor1234",
        #             role="doctor",
        #             phoneNumber=f"05900000{i}",
        #         )
        #         self.stdout.write(self.style.SUCCESS(f"👨‍⚕️ Doctor {i} created."))

        # # Create patients
        # for i in range(1, 11):
        #     email = f"patient{i}@example.com"
        #     if not User.objects.filter(email=email).exists():
        #         User.objects.create_user(
        #             name=f"Patient {i}",
        #             email=email,
        #             password="patient1234",
        #             role="patient",
        #             phoneNumber=f"05600000{i}",
        #         )
        #         self.stdout.write(self.style.SUCCESS(f"🧑‍⚕️ Patient {i} created."))

        self.stdout.write(self.style.SUCCESS("🎉 All users seeded successfully."))
