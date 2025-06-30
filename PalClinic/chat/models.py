
from django.core.validators import RegexValidator
from django.db import models
from Users.models import User

ascii_slug = RegexValidator(r"^[A-Za-z0-9_.-]+$")

class Room(models.Model):

    name = models.SlugField(
        max_length=95,      
        unique=True,
        validators=[ascii_slug],
        allow_unicode=False,
        help_text="ASCII slug – internal id"
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Display name shown to users"
    )
    participants = models.ManyToManyField(User, related_name="rooms")
    class Meta:
        ordering = ["id"]
    def __str__(self):
        return self.title or self.name


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
