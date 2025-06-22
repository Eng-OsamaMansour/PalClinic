# Notifications/middleware.py
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner                               
    async def __call__(self, scope, receive, send):       
        qs = parse_qs(scope["query_string"].decode())
        raw_token = qs.get("token", [None])[0]

        user = AnonymousUser()
        if raw_token:
            try:
                validated = UntypedToken(raw_token)         
                user_id  = validated["user_id"]
                user = await database_sync_to_async(
                    get_user_model().objects.get
                )(id=user_id)

            except (InvalidToken, TokenError, get_user_model().DoesNotExist):
                pass  # leave as AnonymousUser

        scope["user"] = user

        return await self.inner(scope, receive, send)
