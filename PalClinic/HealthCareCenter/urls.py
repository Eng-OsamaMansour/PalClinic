from django.urls import path
from . import views

urlpatterns = [
    path('create/',views.HealthCareCenterCreateView.as_view(), name='create_health_care_center'),
    path('update/<int:pk>',views.HealthCareCenterUpdateView.as_view(),name='update_health_care_center'),
    path('',views.HealthCareCenterListView.as_view(),name='get_Health_Centers'),
    path('<int:health_id>/clinics/',views.HealthCareCenterClinicListView.as_view(),name="get all clinics for this center"),
    path('unassigned',views.UnassignedHealthCareCenterListView.as_view(),name='list of unassigned health care centers'),
    path('assigned/', views.AssignedHealthCareCenterModeratorListView.as_view(), name='returns a list of all active health center-moderator assignments with moderator email and health center name and assignment id')
]