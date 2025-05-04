from django.shortcuts import get_object_or_404, render

from rest_framework import generics,permissions
from .serializers import *
from .permissions import IsDoctorUser, IsOwner,IsAdmin
from Users.models import User
from HealthCareCenter.models import HealthCareCenter

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
        
        return super().patch(request,*args,**kwargs)
    
class GetAllRequestsListView(generics.ListAPIView):
    serializer_class = DoctorAccessRequstSerlizer
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated,IsOwner]

    def get_queryset(self):
        return DoctorAccessRequest.objects.all()
    def get_object(self):
        patient_id = self.kwargs['patient_id']
        return get_object_or_404(DoctorAccessRequest,patient_id='patient_id')
    

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





# @api_view(['GET'])
# @permission_classes([IsPatientUser])
# def list_authorized_doctors(request):
#     doctors = AuthorizedDoctor.objects.filter(patient=request.user, is_active=True)
#     serializer = AuthorizedDoctorSerializer(doctors, many=True)
#     return Response(serializer.data)


# @api_view(['POST'])
# @permission_classes([IsPatientUser])
# def authorize_doctor(request):
#     doctor_id = request.data.get('doctor_id')
#     try:
#         doctor = User.objects.get(id=doctor_id, role='doctor')
#     except User.DoesNotExist:
#         return Response({'error': 'Doctor not found.'}, status=404)

#     auth_obj, created = AuthorizedDoctor.objects.get_or_create(
#         patient=request.user, doctor=doctor,
#         defaults={'is_active': True}
#     )
#     if not created:
#         if auth_obj.is_active:
#             return Response({'detail': 'Doctor is already authorized.'}, status=400)
#         else:
#             auth_obj.is_active = True
#             auth_obj.save()

#     serializer = AuthorizedDoctorSerializer(auth_obj)
#     return Response(serializer.data, status=201)


# @api_view(['POST'])
# @permission_classes([IsPatientUser])
# def revoke_doctor(request, doctor_id):
#     try:
#         auth_obj = AuthorizedDoctor.objects.get(patient=request.user, doctor_id=doctor_id)
#     except AuthorizedDoctor.DoesNotExist:
#         return Response({'error': 'Authorization not found.'}, status=404)

#     auth_obj.is_active = False
#     auth_obj.save()
#     return Response({'detail': 'Doctor authorization revoked.'}, status=200)
