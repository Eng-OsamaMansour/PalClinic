import os
from django.core.asgi import get_asgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PalClinic.settings")

import django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from Notifications.middleware import JWTAuthMiddleware

import Notifications.routing
import chat.routing

websocket_patterns = (
    Notifications.routing.websocket_urlpatterns
    + chat.routing.websocket_urlpatterns
)

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddleware(        
            AuthMiddlewareStack(               
                URLRouter(websocket_patterns)
            )
        ),
    }
)