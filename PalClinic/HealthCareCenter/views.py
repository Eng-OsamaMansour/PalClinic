from django.forms import ValidationError
from rest_framework import generics, permissions
from AccessControl.permissions import IsAdmin,IsHealthAllawoedModeratorOrAdmin
from .serializers import HealthCareCenterSerializer
from HealthCareCenter.models import HealthCareCenter

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
        allowed_fields = {'centerType','address','location','phoneNumber','email','discrption'}
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
        return HealthCareCenter.objects.all()
    def get_object(self):
        return super().get_object()