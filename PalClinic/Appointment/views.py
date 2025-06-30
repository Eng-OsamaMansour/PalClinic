from rest_framework import generics,permissions
from django.db import transaction,models
from AccessControl.permissions import IsClinicAllowedModeratorOrAdmin, IsTheClinicModerator,IsClinicModerator,IsTheAppointmentModerator,IsPatient
from .serializers import *
from Users.models import User
from Clinic.models import Clinic
from .models import Appointment

class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        doctor = User.objects.get(id = self.request.data.get('doctor'))
        clinic = Clinic.objects.get(id = self.request.data.get('clinic'))
        return serializer.save(doctor=doctor,clinic=clinic)


class AppointmentsListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Appointment.objects.filter(clinic = self.kwargs.get("clinic_id"))
    def get_object(self):
        return super().get_object()

    
class AppointmentUpdateView(generics.UpdateAPIView): 
    serializer_class = AppointmentSerializer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsClinicModerator,IsTheAppointmentModerator]
    def get_queryset(self):        
        return Appointment.objects.filter(id=self.kwargs.get('pk'))
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'date','time','doctor','status','updated_at'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
            raise ValidationError('The Fields you are trying to edit is not allowed')
        return super().patch(request, *args, **kwargs)

class AppointmentDestroyView(generics.DestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    http_method_names = ['delete']
    permission_classes = [permissions.IsAuthenticated,IsClinicModerator,IsTheAppointmentModerator]
    
class AppointmentBookCreateView(generics.CreateAPIView):
    serializer_class = AppointmentBookingSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsPatient]

    def get_serializer(self, *args, **kwargs):
        kwargs["data"] = {"appointment": self.kwargs["appointment_id"]}
        return super().get_serializer(*args, **kwargs)
    @transaction.atomic
    def perform_create(self, serializer):
        appointment = Appointment.objects.select_for_update().get(pk = self.kwargs['appointment_id'])
        if not appointment.available:
            raise ValidationError('The Appointment is already booked')
        appointment.available = False
        appointment.save(update_fields=['available'])
        patient = self.request.user
        return serializer.save(appointment = appointment,patient = patient)
    
class AppointmentBookListView(generics.ListAPIView):    
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        role = self.request.user.role
        if role == 'doctor':
            return AppointmentBookedListSerializer  # return booked list with patient info
        if role == 'patient':
            return AppointmentBookedListSerializer  # same serializer, logic inside handles both roles

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return AppointmentBooking.objects.filter(patient=user)
        if user.role == 'doctor':
            return AppointmentBooking.objects.filter(appointment__doctor=user)
    
class AppointmentUnBookView(generics.DestroyAPIView):
    serializer_class   = AppointmentBookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsPatient]
    http_method_names  = ['delete']
    
    lookup_field = "appointment_id"    
    def get_queryset(self):
        return AppointmentBooking.objects.filter(patient=self.request.user)
    
    def perform_destroy(self, instance):
        instance.appointment.available = True
        instance.appointment.save(update_fields=["available"])
        instance.delete()
