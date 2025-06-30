from pathlib import Path
import pandas as pd
from tqdm import tqdm
import openai
from PalClinic.settings import EMBEDDING_MODEL,OPENAI_API_KEY
from AI.models import Embedding

def load_embeddings():
    openai.api_key = OPENAI_API_KEY
    data_path = Path(__file__).resolve().parent / "Data" / "patient_doctor_filtered.csv"
    data = pd.read_csv(data_path)
    doctor = data["doctor"].tolist()
    patient = data["patient"].tolist()
    BATCH = 1000

    for i in tqdm(range(0,len(patient),BATCH), desc="embedding"):
        batch_patient = patient[i:i+BATCH]
        batch_doctor = doctor[i:i+BATCH]

        vectors = openai.embeddings.create(
            model= EMBEDDING_MODEL,
            input= batch_patient
        ).data

        vectors = [v.embedding for v in vectors]

        Embedding.objects.bulk_create([
            Embedding(
                patient = batch_patient[j],
                doctor = batch_doctor[j],
                embedding = vectors[j]
            )
            for j in range(len(batch_patient))],
            batch_size= BATCH
        )
    
    
    print("done – inserted", len(patient), "rows")