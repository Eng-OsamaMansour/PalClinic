from celery import shared_task
from .models import Treatment
from django.utils import timezone

@shared_task
def update_treatments_status():
    today = timezone.now().date()
    treatments = Treatment.objects.filter(active=True, end_date__lt=today)
    treatments.update(active=False)
