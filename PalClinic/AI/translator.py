import os
import requests
import os, requests
from requests.exceptions import RequestException
from Service.translation_service import _translate

SERVICE_URL = os.getenv(
    "TRANSLATION_SERVICE_URL", "http://translation:8008/translate"
)


def _call_service(text: str, direction: str) -> str:
    resp = requests.post(SERVICE_URL, json={"text": text, "direction": direction}, timeout=30)
    resp.raise_for_status()
    return resp.json()["translation"]

def english_to_arabic(text: str) -> str:
    return _call_service(text, "en-ar")

def arabic_to_english(text: str) -> str:
    return _call_service(text, "ar-en")

if __name__ == "__main__":
    print(arabic_to_english("أنا مهندس حاسوب وأحب الأمن السيبراني"))
    print(english_to_arabic("This service loads its model only once."))