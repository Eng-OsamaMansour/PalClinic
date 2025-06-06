from django.db import models
from Users.models import User


class Room(models.Model):
    name = models.CharField(max_length=255)
    participants = models.ManyToManyField(User, related_name="rooms")

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
