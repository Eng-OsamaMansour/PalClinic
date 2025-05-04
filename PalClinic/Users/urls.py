from django.urls import path
from .views import signIn, signUp, signOut, deleteUser, updateUser
urlpatterns = [
    path('signIn/', signIn, name="signIn"),
    path('signUp/', signUp, name="signUp"),
    path('signOut/', signOut, name="signOut"),
    path('<int:user_id>', deleteUser, name="deleteUser"),
    path('<int:user_id>', updateUser, name="updateUser"),
]