from django.urls import path
from . import views as v

urlpatterns = [ 
    # Notifications
    path("", v.NotificationListView.as_view(),name="notifications-list"),
    path("<int:pk>/", v.NotificationDetailView.as_view(), name="notifications-detail"),
    path("<int:pk>/read/", v.NotificationMarkReadView.as_view(),name="notifications-mark-read"),
    path("unread-count/", v.NotificationUnreadCountView.as_view(),name="notifications-unread-count"),
    # Device tokens
    path("device-tokens/", v.DeviceTokenListCreateView.as_view(),name="device-tokens-list-create"),
    path("device-tokens/<int:pk>/", v.DeviceTokenDestroyView.as_view(), name="device-tokens-destroy"),
]