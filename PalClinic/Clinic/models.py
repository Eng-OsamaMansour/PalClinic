from django.db import models
from django.contrib.gis.db import models as geomodels
class Clinic(models.Model):
    class ClinicType(models.TextChoices):
        INDV = 'individual'
        HCCR = 'healthcarecenter'
    
    name = models.CharField(max_length=50, unique=True,default="UNDEFINED")
    clinictype = models.CharField(max_length=20,choices=ClinicType.choices, default=ClinicType.INDV)
    address = models.TextField(max_length=100, default="UNDEFINED")
    phoneNumber = models.CharField(max_length=15,default="UNDEFINED")
    email = models.EmailField(max_length=100,default="UNDEFINED@UNDEFINED",unique=True)
    location = geomodels.PointField(srid=4326, geography=True, null=True, blank=True)
    specialties	= models.TextField(max_length=100,default="UNDEFINED")
    operating_hours = models.JSONField(default=dict,help_text="Structured hours, e.g. {'mon': '9-5', 'tue': '10-4'}",blank=True,null=True)
    is_active = models.BooleanField(max_length=7,default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)


