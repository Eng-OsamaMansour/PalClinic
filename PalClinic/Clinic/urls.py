from django.urls import path
from . import views

urlpatterns = [
    path('create/',views.ClinicCreateView.as_view(),name='create_clinic'),
    path('update/<int:pk>',views.ClinicUpdateView.as_view(),name='update_clinic'),
    path('',views.ClinicListView.as_view(),name= "get all clinics"),
    path('moderators/unassigned/',views.UnassignedClinicListView.as_view(),name='list of unassigned Clinics'),
    path('moderators/assigned/', views.AssignedClinicModeratorListView.as_view(), name='returns a list of all active health center-moderator assignments'),
    path('center/unassigned/',views.UnassignedClinicCenterListView.as_view(),name='list of unassigned Clinics Center'),
    path('center/assigned/', views.AssignedClinicCenter.as_view(), name='returns a list of all active clinic-center assignments'),
    path('mod/',views.ClinicForModeratorView.as_view(),name='the clinic for the moderator')
]