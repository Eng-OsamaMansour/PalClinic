from django.db import models
from django.contrib.gis.db import models as geomodels


class HealthCareCenter(models.Model):
    class TypeChoices(models.TextChoices):
        GOV = 'Goverment'
        PRV = 'Pricvate'
        NP = 'None-Profit'
    name = models.TextField(max_length=50, default="PalClinc")
    centerType = models.CharField(max_length=12,choices=TypeChoices.choices,default=TypeChoices.GOV)
    address = models.TextField(max_length=200, default="UNDEFINED")
    location = geomodels.PointField(srid=4326, geography=True, null=True, blank=True) 
    phoneNumber = models.TextField(max_length=15, default="UNDEFINED")
    email = models.EmailField(max_length=100,default="UNDEFINED@UNDEFINED")
    discrption = models.TextField(max_length=500,default="UNDEFINED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    
