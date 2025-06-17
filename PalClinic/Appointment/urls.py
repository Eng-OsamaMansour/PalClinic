from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.AppointmentCreateView.as_view(), name = 'cerate appointment'),
    path('<int:clinic_id>/',views.AppointmentsListView.as_view(),name='get all appointments for a specific clinic'),
    path('update/<int:pk>/',views.AppointmentUpdateView.as_view(),name= 'update appointment'),
    path('delete/<int:pk>/',views.AppointmentDestroyView.as_view(),name='delete an appointment'),
    path('book/<int:appointment_id>/',views.AppointmentBookCreateView.as_view(),name= 'Book an appointment'),
    path('list/',views.AppointmentBookListView.as_view(),name='list of appointments for users{doctor,patient}'),
    path('unbook/<int:appointment_id>/',views.AppointmentUnBookView.as_view(),name='unbook an appointment'),
]