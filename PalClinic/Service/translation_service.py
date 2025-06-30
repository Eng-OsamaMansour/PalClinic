
from __future__ import annotations

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


class _Translator:
    _cache: dict[str, "_Translator"] = {}

    def __new__(cls, direction: str):
        if direction not in cls._cache:
            cls._cache[direction] = super().__new__(cls)
            cls._cache[direction]._init(direction)
        return cls._cache[direction]

    def _init(self, direction: str):
        src, tgt = direction.split("-")
        name = f"Helsinki-NLP/opus-mt-{src}-{tgt}"
        self.tokenizer = AutoTokenizer.from_pretrained(name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(name).to(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        self.model.eval()

    @torch.inference_mode()
    def __call__(self, text: str) -> str:
        batch = self.tokenizer([text], return_tensors="pt", truncation=True, padding=True).to(
            self.model.device
        )
        output = self.model.generate(**batch)
        return self.tokenizer.decode(output[0], skip_special_tokens=True)


# preload both directions once
_AR_EN = _Translator("ar-en")
_EN_AR = _Translator("en-ar")

def _translate(text: str, direction: str) -> str:
    if direction == "ar-en":
        return _AR_EN(text)
    if direction == "en-ar":
        return _EN_AR(text)
    raise ValueError(f"Unsupported direction: {direction}")

app = FastAPI(title="One-shot Arabic/English MT", version="1.0")

class TranslateIn(BaseModel):
    text: str = Field(..., min_length=1, description="Sentence or paragraph to translate")
    direction: str = Field(..., pattern="^(ar-en|en-ar)$", description="ar-en or en-ar")

class TranslateOut(BaseModel):
    translation: str

@app.post("/translate", response_model=TranslateOut)
async def translate(payload: TranslateIn):
    try:
        return {"translation": _translate(payload.text, payload.direction)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("translation_service:app", host="0.0.0.0", port=8008, reload=False)
