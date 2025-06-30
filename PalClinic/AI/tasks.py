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
from .translator import arabic_to_english,english_to_arabic
import openai
import re
client = openai.OpenAI(api_key=OPENAI_API_KEY)



def _get_bot():
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
def run_monthly_pipeline():
    return chain(
        dump_patient_doctor_csv.s(),
        filter_patient_doctor_csv.s(),
        load_embeddings.s(),
    )()

def _to_en(msg_obj: dict) -> dict:
    txt = msg_obj["content"]
    if re.search(r"[\u0600-\u06FF]", txt):        
        txt = arabic_to_english(txt)
    return {"role": msg_obj["role"], "content": txt}


@shared_task(acks_late=True, soft_time_limit=120)
def gpt_reply(room_id, user_msg_id):
    room  = Room.objects.get(id=room_id)
    bot   = _get_bot()  
    msg =  arabic_to_english(Message.objects.get(id=user_msg_id).body)
    print("------------------------------------------> translated to english ",msg)
    system_prompt = {"role": "system", "content": SYSTEM_PROMPT}    
    history = get_chat_history(room) 
    history_en = [_to_en(m) for m in history]           
    pt, dr, _ = retrieve_similar(msg, 1)[0]
    sample_note = {
        "role": "assistant",
        "content": (
            "Similar real conversation:\n\n"
            f"Patient: {pt}\nDoctor: {dr}"
        ),
    }    
    messages = [
        system_prompt,
        *history_en,                           
        sample_note,
        {"role": "user", "content": msg},
    ]

    print(messages)
    reply = client.chat.completions.create(      
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7
    ).choices[0].message.content
    resp =  english_to_arabic(reply)
    reply_msg = Message.objects.create(room=room, author=bot, body=resp)


    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"room_{room.name}",
        {"type": "chat.message",
         "message": MessageSerializer(reply_msg).data}
    )