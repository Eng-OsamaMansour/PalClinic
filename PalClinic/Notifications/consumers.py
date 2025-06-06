from channels.generic.websocket import AsyncJsonWebsocketConsumer

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
            return
        self.group = f"user_{user.id}"
        await self.channel_layer.group_add(self.group,self.channel_name)
        await self.accept

    async def disconnect(self, code):
        await  self.channel_layer.group_discard(self.group,self.channel_name)
    
    async def send_notification(self,event):
        await self.send_json(event['data'])
