# chat/consumers.py
import json
from urllib.parse     import parse_qs
from django.utils.text import slugify
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db      import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model

from .utils  import get_or_create_private_room
from .models import Room, Message
from .serializers import MessageSerializer
from AI.tasks import gpt_reply

User = get_user_model()

def safe_slug(raw: str) -> str:
    slug = slugify(raw)
    return slug or "room"

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        token = parse_qs(self.scope["query_string"].decode()).get("token", [""])[0]
        self.user = await self._authenticate(token)
        if isinstance(self.user, AnonymousUser):
            await self.close();  return

        raw = self.scope["url_route"]["kwargs"]["room_name"]
        if raw.startswith("assist"):
            room_obj = await database_sync_to_async(get_or_create_private_room)(self.user, raw)
            identifier = room_obj.name
        else:
            identifier = raw    

        self.room_slug       = safe_slug(identifier)
        self.room_group_name = f"room_{self.room_slug}"[:95]

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        body = data.get("message", "")

        msg = await self._create_message(body)

        # broadcast
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat.message", "message": MessageSerializer(msg).data},
        )

        # GPT
        if self.room_slug.startswith("assist-"):
             gpt_reply.delay(msg.room_id, msg.id)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def _create_message(self, body):
        room, _ = Room.objects.get_or_create(name=self.room_slug)
        return Message.objects.create(room=room, author=self.user, body=body)

    @database_sync_to_async
    def _authenticate(self, raw_token):
        try:
            token = UntypedToken(raw_token)
            return User.objects.get(id=token["user_id"])
        except (TokenError, InvalidToken, User.DoesNotExist):
            return AnonymousUser()
