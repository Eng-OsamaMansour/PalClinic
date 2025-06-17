# from transformers import MarianMTModel, MarianTokenizer

# model_name = "Helsinki-NLP/opus-mt-ar-en"
# tokenizer = MarianTokenizer.from_pretrained(model_name)
# model = MarianMTModel.from_pretrained(model_name)

# def translate_arabic_to_english(text: str) -> str:
#     """Translate Arabic text to English using MarianMT."""
#     tokens = tokenizer([text], return_tensors="pt", padding=True, truncation=True)
#     translated = model.generate(**tokens)
#     result = tokenizer.decode(translated[0], skip_special_tokens=True)
#     return result
