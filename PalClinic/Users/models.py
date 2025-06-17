from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role="patient", **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.pop('role', None)
        return self.create_user(email, password, role='admin', **extra_fields)
    

    def create_clinic_moderator(self, email, password=None, **extra_fields):
        return self.create_user(email, password, role='clinic_moderator', **extra_fields)

    def create_doctor(self, email, password=None, **extra_fields):
        return self.create_user(email, password, role='doctor', **extra_fields)

    def create_patient(self, email, password=None, **extra_fields):
        return self.create_user(email, password, role='patient', **extra_fields)

    def create_healthcarecenter_moderator(self, email, password=None, **extra_fields):
        return self.create_user(email, password, role='healthcarecenter_moderator', **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('clinic_moderator', 'Clinic Moderator'),
        ('healthcarecenter_moderator', 'Healthcare Center Moderator'),
        ('assistant','Assistant')
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='patient')
    phoneNumber = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self): 
        return self.email
