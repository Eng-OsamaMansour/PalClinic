import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from .models import Room, Message
from .serializers import MessageSerializer

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'room_{self.room_name}'

        # auth (token in query string)
        token = parse_qs(self.scope["query_string"].decode()).get("token", [""])[0]
        self.user = await self._authenticate(token)

        if isinstance(self.user, AnonymousUser):
            await self.close()
            return

        # join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        body = data.get('message', '')
        msg = await self._create_message(body)

        # broadcast
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': MessageSerializer(msg).data,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    # ---------- helpers ----------
    @database_sync_to_async
    def _create_message(self, body):
        room, _ = Room.objects.get_or_create(name=self.room_name)
        return Message.objects.create(room=room, author=self.user, body=body)

    @database_sync_to_async
    def _authenticate(self, raw_token):
        try:
            validated = UntypedToken(raw_token)        
            return User.objects.get(id=validated["user_id"])
        except (TokenError, InvalidToken, User.DoesNotExist):
            return AnonymousUser()
        
class Echo(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
    async def receive(self, text_data):
        await self.send(text_data=f"echo: {text_data}")