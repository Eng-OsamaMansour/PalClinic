from celery import shared_task,chain
from django.core import management
from pathlib import Path
from chat.serializers import MessageSerializer
from .dataFilter import filter_chat_csv
from .loader import load_embeddings as loader
from chat.models import Room,Message
from Users.models import User
from PalClinic.settings import OPENAI_API_KEY
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from chat.utils import get_chat_history
from asgiref.sync import async_to_sync
from .prompt import SYSTEM_PROMPT
from .retriever import retrieve_similar
#from .translator import translate_arabic_to_english
import openai
client = openai.OpenAI(api_key=OPENAI_API_KEY)



def _get_bot():
    """Fetch (or create) the assistant user lazily and *inside* a thread-safe context."""
    User = get_user_model()
    return User.objects.get_or_create(
        email="assistant@palclinic.ai",
        defaults=dict(username="GPT-Assistant", role="assistant", password="!bot!")
    )[0]    

@shared_task
def dump_patient_doctor_csv():

    dest = Path("/app/AI/Data/patient_doctor.csv")
    dest.parent.mkdir(parents=True, exist_ok=True)

    management.call_command(
        "export_patient_doctor_csv",
        dest=str(dest),
    )
@shared_task
def filter_patient_doctor_csv():
    filter_chat_csv()

@shared_task
def load_embeddings():
    loader()




@shared_task
def gpt_reply(room_id, user_msg_id):
    room  = Room.objects.get(id=room_id)
    bot   = _get_bot()  
    msg = Message.objects.get(id=user_msg_id)#translate_arabic_to_english(Message.objects.get(id=user_msg_id))

    system = SYSTEM_PROMPT
    history = get_chat_history(room)
    sample = retrieve_similar(msg,1)

    messages = [
        f"""system: {system}
    history: {history}
    sample: {sample}"""
    ]

    print(messages)
    reply = client.chat.completions.create(      # new call
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7
    ).choices[0].message.content

    reply_msg = Message.objects.create(room=room, author=bot, body=reply)

    # broadcast assistant reply
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"room_{room.name}",
        {"type": "chat.message",
         "message": MessageSerializer(reply_msg).data}
    )