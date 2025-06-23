from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from AccessControl.permissions import IsAdmin,IsHealthAllawoedModeratorOrAdmin
from AccessControl.models import AssignClinicToHealthCenter, AssignedHealthCareCenterModerators
from Clinic.serializers import ClinicSerializer
from Clinic.models import Clinic
from .serializers import HealthCareCenterSerializer
from HealthCareCenter.models import HealthCareCenter
from rest_framework import serializers
from rest_framework.response import Response


class HealthCareCenterCreateView(generics.CreateAPIView):
    serializer_class = HealthCareCenterSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        serializer.save()

class HealthCareCenterUpdateView(generics.UpdateAPIView):
    queryset = HealthCareCenter.objects.all()
    serializer_class = HealthCareCenterSerializer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsHealthAllawoedModeratorOrAdmin]
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'centerType','address','location','phoneNumber','email','discrption','is_active'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
            raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")
        
        return super().patch(request,*args,**kwargs)
    
class HealthCareCenterListView(generics.ListAPIView):
    serializer_class = HealthCareCenterSerializer
    http_method_names = ['get']
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        return HealthCareCenter.objects.filter(is_active=True)
    def get_object(self):
        return super().get_object()
    

class HealthCareCenterClinicListView(generics.ListAPIView):
    """
    GET /health-centers/<health_id>/clinics/
    Returns all *active* clinics assigned to the given HealthCareCenter.
    """
    serializer_class = ClinicSerializer

    def get_queryset(self):
        health_id = self.kwargs["health_id"]
        get_object_or_404(HealthCareCenter, pk=health_id)

        return (
            Clinic.objects
            .filter(assignclinictohealthcenter__health_id=health_id,
                    assignclinictohealthcenter__is_active=True)
            .select_related()                    # no joins needed, but keeps pattern symmetrical
            .prefetch_related("assignclinictohealthcenter_set")  # future-proof
        )
    

        # INSERT_YOUR_CODE
class UnassignedHealthCareCenterListView(generics.ListAPIView):
    """
    Returns all HealthCareCenters that do not have an active moderator assigned.
    """
    serializer_class = HealthCareCenterSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        # Get all health care centers that either:
        # - do not exist in AssignedHealthCareCenterModerators
        # - or exist only with is_active=False
        assigned_qs = AssignedHealthCareCenterModerators.objects.filter(is_active=True).values_list('healthcarecenter_id', flat=True)
        return HealthCareCenter.objects.exclude(id__in=assigned_qs)


        # INSERT_YOUR_CODE

class AssignedHealthCareCenterModeratorListView(generics.ListAPIView):
    """
    Returns a list of all active health center-moderator assignments,
    with moderator email and health center name and assignment id.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        moderator_email = serializers.EmailField()
        health_center_name = serializers.CharField()

    serializer_class = OutputSerializer

    def get_queryset(self):
        # Only active assignments
        return (
            AssignedHealthCareCenterModerators.objects
            .filter(is_active=True)
            .select_related('moderator', 'healthcarecenter')
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [
            {
                "id": obj.id,
                "moderator_email": obj.moderator.email,
                "health_center_name": obj.healthcarecenter.name,
            }
            for obj in queryset
        ]
        serializer = self.get_serializer(data, many=True)
        return Response(data)


