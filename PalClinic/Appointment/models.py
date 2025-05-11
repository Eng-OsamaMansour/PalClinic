from django.db import models
from Clinic.models import Clinic
from Users.models import User

class Appointment(models.Model):
    class Status(models.TextChoices):
        COMPLETED = 'completed'
        PENDING = 'pending'
        CANCELED = 'canceled'

    date = models.DateField(max_length=20)
    time = models.TimeField(max_length=50)
    clinic = models.ForeignKey(Clinic,on_delete=models.CASCADE)
    doctor = models.ForeignKey(User,on_delete=models.CASCADE,limit_choices_to={"role":"doctor"})
    status = models.CharField(max_length=10,choices=Status.choices,default=Status.PENDING)
    available = models.BooleanField(max_length= 7, default= True)
    created_at = models.DateTimeField(auto_now_add=True,max_length=50)
    updated_at = models.DateTimeField(auto_now_add=True,max_length=50)

class AppointmentBooking(models.Model):
    appointment = models.ForeignKey(Appointment,on_delete=models.CASCADE,limit_choices_to={"available": True}, null=True)
    patient = models.ForeignKey(User,on_delete=models.CASCADE,limit_choices_to={"role":"patient"},null=True)


