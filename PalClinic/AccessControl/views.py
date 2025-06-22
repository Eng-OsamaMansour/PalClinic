from django.shortcuts import get_object_or_404, render

from rest_framework import generics,permissions
from .serializers import *
from .permissions import IsDoctorUser, IsOwner,IsAdmin
from Users.models import User
from HealthCareCenter.models import HealthCareCenter
from Clinic.models import Clinic

class DoctorAccessRequestCreateView(generics.CreateAPIView):
    serializer_class = DoctorAccessRequstSerlizer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated]
    permission_classes = [IsDoctorUser]
    def perform_create(self, serializer):
        patient_id = self.kwargs['patient_id']
        patient = User.objects.get(id = patient_id)
        doctor = self.request.user
        serializer.save(doctor=doctor,patient=patient)

class UpdateStatusOrActiveUpdateView(generics.UpdateAPIView):
    queryset = DoctorAccessRequest.objects.all()
    serializer_class = DoctorAccessRequstSerlizer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsOwner]

    def patch(self, request, *args, **kwargs):
        allowed_fields = {'status','is_active'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        
        if disallowed:
            raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")
        print(request.data)
        return super().patch(request,*args,**kwargs)
    
class GetAllRequestsListView(generics.ListAPIView):
    serializer_class = DoctorAccessRequstSerlizer
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated,IsOwner]

    def get_queryset(self):
        patient_id = self.kwargs['patient_id']
        return DoctorAccessRequest.objects.filter(patient_id = patient_id)
    def get_object(self):
        return super().get_object()

class DoctorAccessRequestDestroyView(generics.DestroyAPIView):
    queryset = DoctorAccessRequest.objects.all()
    http_method_names = ['delete']
    permission_classes = [permissions.IsAuthenticated,IsOwner]
    serializer_class = DoctorAccessRequstSerlizer

class AssignHealthModeratorCreateView(generics.CreateAPIView):
    serializer_class = AssignedHealthCareCenterModeratorsSerlizer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        moderator_id = self.request.data.get('moderator')
        moderator = User.objects.get(id=moderator_id)
        healthcarecenter_id = self.request.data.get('healthcarecenter')
        healthcarecenter = HealthCareCenter.objects.get(id = healthcarecenter_id)
        serializer.save(moderator=moderator,healthcarecenter=healthcarecenter)

class AssignedHealthModeratorUpdateView(generics.UpdateAPIView):
    queryset = AssignedHealthCareCenterModerators.objects.all()
    serializer_class = AssignedHealthCareCenterModeratorsSerlizer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'is_active'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
             raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")
        
        return super().patch(request,*args,**kwargs)
    
class AssignedHealthModeratorListView(generics.ListAPIView):
    serializer_class = AssignedHealthCareCenterModeratorsSerlizer
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def get_queryset(self):
        return AssignedHealthCareCenterModerators.objects.all()
    def get_object(self):
        return super().get_object()

class AssignClinicModeratorCreateView(generics.CreateAPIView):
    serializer_class = AssignClinicModeratorSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        moderator_id = self.request.data.get('moderator')
        clinic_id = self.request.data.get('clinic')
        moderator = User.objects.get(id = moderator_id)
        clinic = Clinic.objects.get(id = clinic_id)
        serializer.save(moderator = moderator, clinic = clinic)


class AssignCLinicModeratorUpdateView(generics.UpdateAPIView):
    queryset = AssignClinicModerators.objects.all()
    serializer_class = AssignClinicModeratorSerializer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'is_active'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
             raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")
        
        return super().patch(request,*args,**kwargs)

class AssignedClinichModeratorListView(generics.ListAPIView):
    serializer_class = AssignClinicModeratorSerializer
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def get_queryset(self):
        return AssignClinicModerators.objects.all()
    def get_object(self):
        return super().get_object()
    

class AssignClinicToHealthCenterCreateView(generics.CreateAPIView):
    serializer_class = AssignClinicToHealthCenterSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        clinic = Clinic.objects.get(id = self.request.data.get('clinic'))
        health = HealthCareCenter.objects.get(id = self.request.data.get('health'))
        
        serializer.save(clinic = clinic,health=health)

class AssignClinicToHealthCenterUpdateView(generics.UpdateAPIView):
    queryset = AssignClinicToHealthCenter.objects.all()
    serializer_class = AssignClinicToHealthCenterSerializer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'is_active'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
             raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")
        
        return super().patch(request,*args,**kwargs)


class AssignClinicToHealthCenterListView(generics.ListAPIView):
    serializer_class = AssignClinicToHealthCenterSerializer
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def get_queryset(self):
        return AssignClinicToHealthCenter.objects.filter(health_id = self.kwargs.get('health_id'))
    def get_object(self):
        return super().get_object()
    
class AssignDoctorToClinkCreateView(generics.CreateAPIView):
    serializer_class = AssignDoctorToClinicSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        doctor = User.objects.get(id = self.request.data.get('doctor'))
        clinic = Clinic.objects.get(id = self.request.data.get('clinic'))
        serializer.save(doctor = doctor,clinic = clinic)

class AssignDoctorToClinicUpdateView(generics.UpdateAPIView):
    queryset = AssignDoctorToClinic.objects.all()
    serializer_class = AssignDoctorToClinicSerializer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'is_active'}
        requested_fileds = set(request.data.keys())
        disallowed = requested_fileds - allowed_fields
        if disallowed:
            raise ValidationError("you dont allowed to update this fields")        
        return super().patch(request, *args, **kwargs)

class AssignDoctorToClinicListView(generics.ListAPIView):
    serializer_class = AssignDoctorToClinicSerializer
    http_method_names = ['get']
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        return AssignDoctorToClinic.objects.filter(clinic_id = self.kwargs.get('clinic_id'))
    def get_object(self):
        return super().get_object()
