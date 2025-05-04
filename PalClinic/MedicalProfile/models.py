from django.db import models
from django.utils import timezone
from Users.models import User


class MedicalProfile(models.Model):
    patient = models.OneToOneField(User, on_delete=models.CASCADE, related_name='medical_profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class BasicInfo(models.Model):
    medical_profile = models.OneToOneField(MedicalProfile, on_delete=models.CASCADE, related_name='basic_info' ,null=True, blank=True) 
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    height = models.FloatField()    
    weight = models.FloatField()
    blood_type = models.CharField(max_length=3)
    allergies = models.TextField(max_length=1000, null=True, blank=True)
    chronic_conditions = models.TextField(max_length=1000, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Surgery(models.Model):
    medical_profile = models.ForeignKey(MedicalProfile, on_delete=models.CASCADE, related_name='surgeries' ,null=True, blank=True) 
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='performed_surgeries',null=True, blank=True)
    surgery_type = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    report = models.FileField(upload_to='files/surgery_reports/')
    surgery_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)


class LabTest(models.Model):
    medical_profile = models.ForeignKey(MedicalProfile, on_delete=models.CASCADE, related_name='lab_tests', null=True, blank=True) 
    name = models.CharField(max_length=100,null=True, blank=True)
    description = models.TextField(max_length=1000,null=True, blank=True)
    results = models.FileField(upload_to='files/lab_results/',null=True, blank=True)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)


class Treatment(models.Model):
    medical_profile = models.ForeignKey(MedicalProfile, on_delete=models.CASCADE, related_name='treatments' ,null=True, blank=True) 
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='treatments',null=True, blank=True)
    treatment = models.CharField(max_length=300,null=True, blank=True)
    dosage = models.CharField(max_length=100,null=True, blank=True)
    description = models.TextField(max_length=300,null=True, blank=True)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    @property
    def is_active(self):
        return self.active and (self.end_date is None or self.end_date >= timezone.now().date())

class DoctorNote(models.Model):
    medical_profile = models.ForeignKey(MedicalProfile, on_delete=models.CASCADE, related_name='doctor_notes', null=True, blank=True) 
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes',null=True, blank=True)
    title = models.CharField(max_length=255,null=True, blank=True)
    note = models.TextField(max_length=2000,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
