from django.urls import path
from . import views

urlpatterns = [
    path('create/',views.HealthCareCenterCreateView.as_view(), name='create_health_care_center'),
    path('update/<int:pk>',views.HealthCareCenterUpdateView.as_view(),name='update_health_care_center'),
    path('',views.HealthCareCenterListView.as_view(),name='get_Health_Centers'),
]