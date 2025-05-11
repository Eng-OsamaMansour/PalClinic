from sqlite3 import Date
from django.forms import ValidationError
from django.utils import timezone
from rest_framework import serializers
from .models import Appointment,AppointmentBooking
from Clinic.models import Clinic
from Users.models import User
from AccessControl.models import AssignDoctorToClinic


class AppointmentSerializer(serializers.ModelSerializer):
    date = serializers.DateField(required=False)
    time = serializers.TimeField(required=False)
    class Meta:
        model = Appointment
        fields = ['id', 'date', 'time', 'clinic', 'doctor','status', 'available', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    def validate(self, attrs):
        request = self.context['request']
        method  = request.method
        if method in ('POST'):
            if 'date' not in attrs or 'time' not in attrs:
                raise ValidationError("Both 'date' and 'time' are required.")
        instance = getattr(self, 'instance', None)
        current_date = attrs.get('date', getattr(instance, 'date', None))
        current_time = attrs.get('time', getattr(instance, 'time', None))
        if current_date and current_time:
            now = timezone.localtime()
            if current_date < now.date():
                raise ValidationError("The date can't be in the past.")
            if current_date == now.date() and current_time < now.time():
                raise ValidationError("The time can't be in the past.")
        if 'date' in attrs and 'time' in attrs:
            clinic_id  = attrs.get('clinic', getattr(instance, 'clinic_id', None))
            doctor_id  = attrs.get('doctor', getattr(instance, 'doctor_id', None))
            if Appointment.objects.filter(
                doctor=doctor_id,
                clinic=clinic_id,
                date=current_date,
                time=current_time
            ).exclude(id=getattr(instance, 'id', None)).exists():
                raise ValidationError("Another appointment is already booked for that slot.")
        if 'clinic' in attrs and not Clinic.objects.filter(id=attrs['clinic']).exists():
            raise ValidationError("Clinic does not exist.")
        if 'doctor' in attrs and not User.objects.filter(id=attrs['doctor']).exists():
            raise ValidationError("Doctor does not exist.")
        if 'clinic' in attrs or 'doctor' in attrs:
            clinic_id = attrs.get('clinic', getattr(instance, 'clinic_id', None))
            doctor_id = attrs.get('doctor', getattr(instance, 'doctor_id', None))
            if clinic_id and doctor_id and not AssignDoctorToClinic.objects.filter(
                    clinic=clinic_id, doctor=doctor_id, is_active=True).exists():
                raise ValidationError("This doctor is not assigned to that clinic.")

        return attrs
        
class AppointmentBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentBooking
        fields = ['appointment']
    def validate(self, attrs):
        patient = self.context["request"].user
        appointment: Appointment = attrs["appointment"]
        if not appointment.available:
            raise ValidationError("This appointment is already booked.")
        if AppointmentBooking.objects.filter(
            patient=patient,
            appointment__date=appointment.date,
            appointment__time=appointment.time
        ).exists():
            raise ValidationError("You already have an appointment at that time.")
        if AppointmentBooking.objects.filter(
                patient=patient,
                appointment__date=appointment.date,
                appointment__doctor=appointment.doctor).exists():
            raise serializers.ValidationError("You’re already booked with this doctor that day.")
        return attrs
    
class AppointmentBookedListSerializer(serializers.ModelSerializer):
    appointment = AppointmentSerializer(read_only =True)
    class Meta:
        model = AppointmentBooking
        fields = ['appointment']



