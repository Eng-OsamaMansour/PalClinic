from .models import Embedding
from pgvector.django import CosineDistance
import openai
from PalClinic.settings import OPENAI_API_KEY,EMBEDDING_MODEL
openai.api_key = OPENAI_API_KEY


def retrieve_similar(query, k=1):
    query_vector = openai.embeddings.create(
        model= EMBEDDING_MODEL, input=query).data[0].embedding

    hits = (
        Embedding.objects
        .annotate(score=CosineDistance("embedding", query_vector))
        .order_by("score")[:k]
    )
    return [(h.patient, h.doctor, float(h.score)) for h in hits]

