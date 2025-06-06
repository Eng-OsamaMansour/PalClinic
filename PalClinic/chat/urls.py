from django.urls import path
from .views import RoomCreateView, RoomListView, MessageCreateView, MessageListView

urlpatterns = [
    path("rooms/", RoomListView.as_view(), name="room-list"),
    path("rooms/create/", RoomCreateView.as_view(), name="room-create"),
    path("rooms/<int:pk>/messages/", MessageListView.as_view(), name="message-list"),
    path("rooms/<int:pk>/messages/create/", MessageCreateView.as_view(), name="message-create"),
]

