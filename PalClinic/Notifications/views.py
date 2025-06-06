from django.forms import ValidationError
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notifications
from .models import Notifications,DeviceToken
from .serializers import NotificationSerializer, DeviceTokenSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']
    def get_queryset(self):
        return Notifications.objects.filter(recipient=self.request.user)
    def get_object(self):
        return super().get_object()


class NotificationDetailView(generics.RetrieveAPIView):
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']
    def get_queryset(self):
        notification = self.kwargs['pk']
        return Notifications.objects.filter(recipient = self.request.user , id = notification)
    def get_object(self):
        return super().get_object()


class NotificationMarkReadView(generics.UpdateAPIView):
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']
    def get_queryset(self):
        return Notifications.objects.filter(recipient=self.request.user)
    def patch(self, request, *args, **kwargs):
        allowed_fields = {'unread'}
        requested_fields = set(self.request.data.keys())
        disallowed = requested_fields - allowed_fields
        if disallowed:
            raise ValidationError("you are not allowed to modify this")
        return super().patch(request,*args,**kwargs)


class NotificationUnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']
    def get(self, request):
        count = Notifications.objects.filter(
            recipient=request.user, unread=True
        ).count()
        return Response({"unread": count})

class DeviceTokenListCreateView(generics.ListCreateAPIView):
    serializer_class   = DeviceTokenSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return DeviceToken.objects.filter(owner=self.request.user)
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DeviceTokenDestroyView(generics.DestroyAPIView):
    serializer_class   = DeviceTokenSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return DeviceToken.objects.filter(owner=self.request.user)
