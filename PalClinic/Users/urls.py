from django.urls import path
from .views import signIn, signUp, signOut, deleteUser, updateUser,refresh_token , get_user_info
urlpatterns = [
    path('signIn/', signIn, name="signIn"),
    path('signUp/', signUp, name="signUp"),
    path('signOut/', signOut, name="signOut"),
    path('<int:user_id>', deleteUser, name="deleteUser"),
    path('<int:user_id>', updateUser, name="updateUser"),
    path('token/refresh/', refresh_token, name='token_refresh'),
    path('me/', get_user_info, name='get_user_info'),
]