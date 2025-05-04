from django.urls import path
from . import views

urlpatterns = [
    path('create/',views.ClinicCreateView.as_view(),name='create_clinic'),
    
]