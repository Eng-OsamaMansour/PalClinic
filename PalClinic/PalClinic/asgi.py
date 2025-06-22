# PalClinic/asgi.py  – patched
import os
from django.core.asgi import get_asgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "PalClinic.settings")

# 1️⃣ initialise Django first
import django
django.setup()

# 2️⃣ now it's safe to touch app code that imports models
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
        "websocket": JWTAuthMiddleware(          # JWT first
            AuthMiddlewareStack(                 # session fallback
                URLRouter(websocket_patterns)
            )
        ),
    }
)