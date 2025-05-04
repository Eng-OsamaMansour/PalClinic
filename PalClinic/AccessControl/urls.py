from django.urls import path
from . import views



urlpatterns = [
    path('access_request/<int:patient_id>',views.DoctorAccessRequestCreateView.as_view(),name='send_access_request'),
    path('access_request/update/<int:pk>', views.UpdateStatusOrActiveUpdateView.as_view(), name='update_request'),
    path('access_requst/get/<int:patient_id>',views.GetAllRequestsListView.as_view(), name='get_requsets'),
    path('assignealthmoderator',views.AssignHealthModeratorCreateView.as_view(),name='assign_health_moderator'),
    path('assignedhealthmodirator/update/<int:pk>',views.AssignedHealthModeratorUpdateView.as_view(), name = 'update_assigned_moderator'),
    path("assignedhealthmodirator/",views.AssignedHealthModeratorListView.as_view(),name='get_all_moderators'),
    path('assignclinicmoderator/',views.AssignClinicModeratorCreateView.as_view(),name='assign clinic moderator')
    # path('authorized-doctors/', list_authorized_doctors, name='list-authorized-doctors'),
    # path('authorize-doctor/', authorize_doctor, name='authorize-doctor'),
    # path('revoke-doctor/<int:doctor_id>/', revoke_doctor, name='revoke-doctor'),
]
