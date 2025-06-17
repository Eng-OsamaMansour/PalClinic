from chat.models import Room
from django.contrib.auth import get_user_model
from chat.models import Message
User = get_user_model()
BOT_ID = User.objects.get(email="assistant@palclinic.ai").id

def get_or_create_private_room(user) -> Room:
    """
    Returns the 1-on-1 assistant room for `user`,
    creating it and adding the bot participant if needed.
    """
    room_name = f"assist-{user.id}"
    room, _ = Room.objects.get_or_create(name=room_name)
    if not room.participants.filter(id=user.id).exists():
        room.participants.add(user)
    if not room.participants.filter(id=BOT_ID).exists():
        room.participants.add(BOT_ID)
    return room



def get_chat_history(room: Room, limit=20):
    """Return last `limit` msgs in OpenAI chat format."""
    msgs = (
        Message.objects
        .filter(room=room)
        .select_related("author")
        .order_by("-created_at")[:limit][::-1]  # chronological
    )
    formatted = []
    for m in msgs:
        role = "assistant" if getattr(m.author, "role", "") == "assistant" else "user"
        formatted.append({"role": role, "content": m.body})
    return formatted