
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import MedicalProfile
from AccessControl.permissions import *
from .serializers import  *

# Authenticated Patient
# Tested Done 3/5/2025
class MedicalProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated,IsPatient]
    http_method_names = ['post']   
    def perform_create(self, serializer):  
        serializer.save(patient=self.request.user)

# Authenticated Paitent and should be the owner
# Tested Done 3/5/2025
class BasicInfoListCreateView(generics.ListCreateAPIView):
    serializer_class = BasicInfoSerializer
    permission_classes = [permissions.IsAuthenticated,IsPatient]
    http_method_names = ['post']

    def perform_create(self, serializer):
        paitent_id = self.request.user.id
        medical_profile = MedicalProfile.objects.get(patient=paitent_id)
        serializer.save(medical_profile=medical_profile)

# Authenticated Doctor and allowed for a specific Patient
# Tested Done 3/5/2025
class SurgeryListCreateView(generics.ListCreateAPIView):
    serializer_class = SurgerySerializer
    permission_classes = [permissions.IsAuthenticated,IsDoctor,IsAllowedDoctor]
    http_method_names = ['post']

    def perform_create(self, serializer):
        doctor = self.request.user
        paitent_id = self.kwargs['paitent_id']
        medical_profile = MedicalProfile.objects.get(patient=paitent_id)
        serializer.save(medical_profile=medical_profile, doctor=doctor)

class LabTestListCreateView(generics.ListCreateAPIView):
    serializer_class = LabTestSerializer
    permission_classes = [permissions.IsAuthenticated,IsDoctor,IsAllowedDoctor]
    http_method_names = ['post']

    def perform_create(self, serializer):
        paitent_id = self.kwargs['paitent_id']
        medical_profile = MedicalProfile.objects.get(patient=paitent_id)
        serializer.save(medical_profile=medical_profile)

class TreatmentListCreateView(generics.ListCreateAPIView):

    serializer_class = TreatmentSerializer
    permission_classes = [permissions.IsAuthenticated,IsDoctor,IsAllowedDoctor]
    http_method_names = ['post']

    def perform_create(self,serlizer):
        doctor = self.request.user
        paitent_id = self.kwargs['paitent_id']
        medical_profile = MedicalProfile.objects.get(patient = paitent_id)
        serlizer.save(medical_profile = medical_profile, doctor = doctor)

class DoctorNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = DoctorNoteSerializer
    permission_classes = [permissions.IsAuthenticated,IsDoctor,IsAllowedDoctor]
    http_method_names = ['post']

    def perform_create(self,serlizer):
        doctor = self.request.user
        paitent_id = self.kwargs['paitent_id']
        medical_profile = MedicalProfile.objects.get(patient = paitent_id)
        serlizer.save(medical_profile = medical_profile, doctor = doctor)
    

class MedicalProfileDetailView(generics.RetrieveAPIView):
    serializer_class = MedicalProfileDetailSerializer
    permission_classes = [permissions.IsAuthenticated,IsOwnerOrAllowedDoctor]
    http_method_names = ['get']
    def get_queryset(self):
        return MedicalProfile.objects.all()

    def get_object(self):
        patient_id = self.kwargs['paitent_id']
        return get_object_or_404(MedicalProfile, patient=patient_id)
