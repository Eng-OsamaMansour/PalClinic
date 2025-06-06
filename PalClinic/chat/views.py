from django.forms import ValidationError
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer


# POST: /chat/rooms/
class RoomCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer

    def perform_create(self, serializer):
        serializer.save(participants=[self.request.user])


# GET: /chat/rooms/
class RoomListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer

    def get_queryset(self):
        return self.request.user.rooms.all()

# POST: /chat/rooms/<int:pk>/messages/
class MessageCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        room = Room.objects.get(id= self.kwargs["pk"])
        if self.request.user not in room.participants.all():
            raise ValidationError("You are not a participant of this room")
        serializer.save(room=room, author=self.request.user)

# GET: /chat/rooms/<int:pk>/messages/
class MessageListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        room = Room.objects.get(id= self.kwargs["pk"])
        if self.request.user not in room.participants.all():
            raise ValidationError("You are not a participant of this room")
        return Message.objects.filter(room=room)