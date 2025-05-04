from rest_framework import generics,permissions
from AccessControl.permissions import *
from .serializers import *

class ClinicCreateView(generics.CreateAPIView):
    serializer_class = ClinicSerializer
    http_method_names = ['post']
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    def perform_create(self, serializer):
        return super().perform_create(serializer)