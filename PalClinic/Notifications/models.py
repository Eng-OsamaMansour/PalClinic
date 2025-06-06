from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings
from django.utils import timezone



class Notifications(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete= models.CASCADE,related_name="notifications",)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL,blank=True,null=True,on_delete=models.SET_NULL,related_name="actor_notifications")
    target_ct = models.ForeignKey(ContentType,null=True,blank=True,on_delete=models.SET_NULL)
    target_id = models.PositiveBigIntegerField(null=True,blank=True)
    target = GenericForeignKey("target_ct","target_id")
    verb = models.CharField(max_length=150)
    unread = models.BooleanField(default=True)
    timestamp = models.DateTimeField(default=timezone.now)
    payload = models.JSONField(blank=True)

    class Meta:
        ordering = ["-timestamp"]
    
class DeviceToken(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="device_tokens",on_delete=models.CASCADE)
    token       = models.CharField(max_length=255, unique=True)
    platform    = models.CharField(max_length=10, choices=[("ios","iOS"),("android","Android")])
    created_at  = models.DateTimeField(auto_now_add=True)

    