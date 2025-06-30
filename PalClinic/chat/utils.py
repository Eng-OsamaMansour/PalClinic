from chat.models import Room
from django.contrib.auth import get_user_model
from chat.models import Message
User = get_user_model()
BOT_ID = User.objects.get(email="assistant@palclinic.ai").id

def get_or_create_private_room(user, raw_name: str) -> Room:
    if not raw_name.startswith(f"assist-{user.id}"):
        raise ValueError("Patient can only join their own assistant rooms")

    room, _ = Room.objects.get_or_create(name=raw_name)
    bot = User.objects.get(email="assistant@palclinic.ai")   # already exists
    room.participants.add(user, bot)
    return room


def get_chat_history(room: Room, limit=20):
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