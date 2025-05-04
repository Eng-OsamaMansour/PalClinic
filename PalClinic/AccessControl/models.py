from django.db import models
from Users.models import User
from HealthCareCenter.models import HealthCareCenter
class DoctorAccessRequest(models.Model):
    class StatusChoices(models.TextChoices):
        ACCEPTED = 'accepted'
        REJECTED = 'rejected'
        PENDING = 'pending'

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authorized_doctors', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authorized_patients', limit_choices_to={'role': 'doctor'})
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AssignedHealthCareCenterModerators(models.Model):
    moderator = models.ForeignKey(User,on_delete=models.CASCADE,limit_choices_to={'role': 'healthcarecenter_moderator'})
    healthcarecenter = models.ForeignKey(HealthCareCenter,on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
