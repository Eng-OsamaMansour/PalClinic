from django.urls import path
from . import views

urlpatterns = [
    path('create/',views.ClinicCreateView.as_view(),name='create_clinic'),
    path('update/<int:pk>',views.ClinicUpdateView.as_view(),name='update_clinic'),
    path('',views.ClinicListView.as_view(),name= "get all clinics"),

]