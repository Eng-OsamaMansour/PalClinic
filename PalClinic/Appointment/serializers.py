from sqlite3 import Date
from django.forms import ValidationError
from django.utils import timezone
from rest_framework import serializers
from .models import Appointment,AppointmentBooking
from Clinic.models import Clinic
from Users.models import User
from Users.serializer import UserShortInfoSerlizer
from AccessControl.models import AssignDoctorToClinic


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)
    print(doctor_name)
    print(clinic_name)

    date = serializers.DateField(required=False)
    time = serializers.TimeField(required=False)

    class Meta:
        model = Appointment
        fields = [
            'id', 'date', 'time', 'clinic', 'clinic_name',
            'doctor', 'doctor_name', 'status', 'available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    def validate(self, attrs):
        request  = self.context['request']
        instance = getattr(self, 'instance', None)
        method   = request.method
        if method == 'POST':
            if 'date' not in attrs or 'time' not in attrs:
                raise ValidationError("Both 'date' and 'time' are required.")
    
        current_date = attrs.get('date',  getattr(instance, 'date',  None))
        current_time = attrs.get('time',  getattr(instance, 'time',  None))
    
        if current_date and current_time:
            now = timezone.localtime()
            if current_date < now.date():
                raise ValidationError("The date can't be in the past.")
            if current_date == now.date() and current_time < now.time():
                raise ValidationError("The time can't be in the past.")
    
        clinic  = attrs.get('clinic',  getattr(instance, 'clinic',  None))
        doctor  = attrs.get('doctor',  getattr(instance, 'doctor',  None))
    
        if current_date and current_time and clinic and doctor:
            clash = (
                Appointment.objects
                .filter(clinic=clinic, doctor=doctor,
                        date=current_date, time=current_time)
                .exclude(id=getattr(instance, 'id', None))
                .exists()
            )
            if clash:
                raise ValidationError("Another appointment is already booked for that slot.")

        if clinic and doctor and not AssignDoctorToClinic.objects.filter(
                clinic=clinic, doctor=doctor, is_active=True).exists():
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
    appointment = AppointmentSerializer(read_only=True)
    patient_info = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentBooking
        fields = ['appointment', 'patient_info']

    def get_patient_info(self, obj):
        request = self.context.get('request')
        if request and request.user.role == 'doctor':
            return UserShortInfoSerlizer(obj.patient).data
        return None


