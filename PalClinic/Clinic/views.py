from amqp import NotFound
from django.forms import ValidationError
from rest_framework import generics,permissions
from AccessControl.permissions import *
from AccessControl.models import AssignClinicModerators, AssignClinicToHealthCenter
from .serializers import *
from rest_framework.response import Response

class ClinicCreateView(generics.CreateAPIView):
    serializer_class = ClinicSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        return super().perform_create(serializer)
    

class ClinicUpdateView(generics.UpdateAPIView):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    http_method_names = ['patch']
    permission_classes = [permissions.IsAuthenticated,IsClinicAllowedModeratorOrAdmin]
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'clinictype','address','location','phoneNumber','email','operating_hours','is_active','specialties',''}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
            raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")
        return super().patch(request, *args, **kwargs)
        

class ClinicListView(generics.ListAPIView):
    serializer_class = ClinicSerializer
    http_method_names = ['get']
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        return Clinic.objects.all()
    def get_object(self):
        return super().get_object()


class UnassignedClinicListView(generics.ListAPIView):
    serializer_class = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        assigned_qs = AssignClinicModerators.objects.filter(is_active=True).values_list('clinic_id', flat=True)
        return Clinic.objects.exclude(id__in=assigned_qs)


class AssignedClinicModeratorListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        moderator_email = serializers.EmailField()
        clinic_name = serializers.CharField()

    serializer_class = OutputSerializer

    def get_queryset(self):
        return (
            AssignClinicModerators.objects
            .filter(is_active=True)
            .select_related('moderator', 'clinic')
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [
            {
                "id": obj.id,
                "moderator_email": obj.moderator.email,
                "clinic_name": obj.clinic.name,
            }
            for obj in queryset
        ]
        serializer = self.get_serializer(data, many=True)
        return Response(data)


class UnassignedClinicCenterListView(generics.ListAPIView):
    serializer_class   = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        active_clinic_ids = (AssignClinicToHealthCenter.objects
                             .filter(is_active=True)
                             .values_list('clinic_id', flat=True))
        return (Clinic.objects
                      .filter(clinictype='healthcarecenter')
                      .exclude(id__in=active_clinic_ids))
    
class AssignedClinicCenter(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        center_name = serializers.CharField()
        clinic_name = serializers.CharField()
    
    serializer_class = OutputSerializer

    def get_queryset(self):
        return AssignClinicToHealthCenter.objects.filter(is_active = True).select_related('health','clinic')
    
    def list(self, request, *args, **kwargs):
        query_set = self.get_queryset()
        data = [
            {            
                "id": obj.id,
                "clinic_name": obj.clinic.name,
                "health_name": obj.health.name
            }
            for obj in query_set
        ]
        serializer = self.get_serializer(data, many=True)
        return Response(data)
        


class ClinicForModeratorView(generics.RetrieveAPIView):
    serializer_class   = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated, IsClinicModerator]

    def get_object(self):
        try:
            return (AssignClinicModerators.objects
                    .get(moderator=self.request.user)
                    .clinic)
        except AssignClinicModerators.DoesNotExist:
            raise NotFound("لم يتم ربط أي عيادة بهذا المشرف.")