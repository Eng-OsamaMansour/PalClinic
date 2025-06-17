from django.db import models
from pgvector.django import VectorField, IvfflatIndex

class Embedding(models.Model):
    patient     = models.TextField()
    doctor   = models.TextField()
    embedding  = VectorField(dimensions=1536)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            IvfflatIndex(                    
                fields=["embedding"],
                name="chat_embed_ivf_cos",
                opclasses=["vector_cosine_ops"],
            ),
        ]
