from django.urls import path
from . import views



urlpatterns = [
    path('access_request/<int:patient_id>',views.DoctorAccessRequestCreateView.as_view(),name='send_access_request'),
    path('access_request/update/<int:pk>', views.UpdateStatusOrActiveUpdateView.as_view(), name='update_request'),
    path('access_requst/get/<int:patient_id>',views.GetAllRequestsListView.as_view(), name='get_requsets'),
    path('assignealthmoderator',views.AssignHealthModeratorCreateView.as_view(),name='assign_health_moderator'),
    path('assignedhealthmodirator/update/<int:pk>',views.AssignedHealthModeratorUpdateView.as_view(), name = 'update_assigned_moderator'),
    path("assignedhealthmodirator/",views.AssignedHealthModeratorListView.as_view(),name='get_all_moderators'),
    path('assignclinicmoderator/',views.AssignClinicModeratorCreateView.as_view(),name='assign clinic moderator'),
    path('assignclinicmoderator/update/<int:pk>',views.AssignCLinicModeratorUpdateView.as_view(),name='update assign clinic moderator'),
    path('assignclinicmoderator/get/',views.AssignedClinichModeratorListView.as_view(),name='get all clinic moderator'),
    path('assignclinichealth/',views.AssignClinicToHealthCenterCreateView.as_view(), name="assign clinic to health care center"),
    path('assignclinichealth/update/<int:pk>',views.AssignClinicToHealthCenterUpdateView.as_view(), name="update assign clinic to health care center"),
    path('assignclinichealth/<int:health_id>',views.AssignClinicToHealthCenterListView.as_view(), name= 'Clinics under this health center')
]
