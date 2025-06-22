from channels.generic.websocket import AsyncJsonWebsocketConsumer

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:                          # ↙ early-exit leaves no .group
            await self.close()
            return

        self.group = f"user_{user.id}"
        await self.channel_layer.group_add(self.group, self.channel_name)

        await self.accept()                            # <- () were missing

    async def disconnect(self, code):
        # If connect() bailed out we don't have self.group yet
        if hasattr(self, "group"):
            await self.channel_layer.group_discard(self.group, self.channel_name)

    async def send_notification(self, event):
        await self.send_json(event["data"])