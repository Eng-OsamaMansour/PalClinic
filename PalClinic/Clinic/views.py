from django.forms import ValidationError
from rest_framework import generics,permissions
from AccessControl.permissions import *
from .serializers import *

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
        allowed_fields = {'clinictype','address','location','phoneNumber','email'}
        requested_fields = set(request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
            raise ValidationError(f"You can only update: {allowed_fields}. Not allowed: {disallowed}")