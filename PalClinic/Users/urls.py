from django.urls import path
from .views import *
urlpatterns = [
    path('signIn/', signIn, name="signIn"),
    path('signUp/', signUp, name="signUp"),
    path('signOut/', signOut, name="signOut"),
    path('<int:user_id>', deleteUser, name="deleteUser"),
    path('<int:user_id>', updateUser, name="updateUser"),
    path('token/refresh/', refresh_token, name='token_refresh'),
    path('me/', get_user_info, name='get_user_info'),
    path('create_hc_moderator/', create_hc_moderator, name='create_hc_moderator'),
    path('get_hc_moderators/',get_healthcarecenter_moderators,name='get_hc_moderators'),
    path('create_c_moderator/', create_c_moderator, name='create_c_moderator'),
    path('get_c_moderators/',get_clinic_moderators,name='get_hc_moderators'),
    path('create_doctor/', create_Doc, name='create_doctor'),
    path('get_doctor/',get_doctors,name='get_doctors'),
    path('get_patient/',get_patient,name="get_patients")
] 