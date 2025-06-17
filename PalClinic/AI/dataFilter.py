from __future__ import annotations

import json
import re
import uuid
from pathlib import Path
from typing import List, Tuple

import pandas as pd
from tqdm import tqdm
import os

GREET_RGX = re.compile(
    r"^(hi|hello|hey|dear|good (morning|afternoon|evening))[^\n]{0,60}\n?",
    re.I,
)

CLOSE_RGX = re.compile(
    r"(regards?|thank(?:s| you)|take care|hope\s+i\s+have\s+answered.*?(?:query|question).*?|let\s+me\s+know\s+if\s+i\s+can\s+assist\s+you\s+further)[^\n]*?$",
    re.I,
)
EMAIL_RGX = re.compile(r"\b[\w.+-]+@\w+\.\w+\b")
PHONE_RGX = re.compile(r"\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b")
NAME_FILL = re.compile(r"\bX{2,}\b")
AGE_RGX = re.compile(r"\b(\d{1,3})\s*(?:years?|yrs?|yr)?\s*old\b", re.I)
EXTRA = re.compile(r"<end>")
AGE_BINS: List[Tuple[int, int]] = [
    (0, 5),
    (5, 10),
    (10, 15),
    (15, 20),
    (20, 30),
    (30, 40),
    (40, 50),
    (50, 60),
    (60, 70),
    (70, 120),
]

def _age_bin(age: int) -> str:
    for lo, hi in AGE_BINS:
        if lo <= age < hi:
            return f"{lo}-{hi - 1}" if hi < 120 else "70+"
    return "UNK"


def scrub(text: str) -> str:
    """Remove PII & boiler‑plate but keep clinical meaning."""
    txt = str(text).replace("<start>", "")  # system token
    txt = EMAIL_RGX.sub("[EMAIL]", txt)
    txt = PHONE_RGX.sub("[PHONE]", txt)
    txt = NAME_FILL.sub("[NAME]", txt)
    txt = AGE_RGX.sub(lambda m: f"[AGE:{_age_bin(int(m.group(1)))}]", txt)
    txt = GREET_RGX.sub("", txt)
    txt = CLOSE_RGX.sub("", txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    txt = EXTRA.sub("", txt)
    return txt

def filter_chat_csv():
    min_q = 10
    max_q = 200
    min_a = 20
    max_a = 250
    export_format = "csv"
    patient_col = "Patient"
    doctor_col = "Doctor"
    csv_path = os.path.join(os.path.dirname(__file__), "Data", "patient_doctor.csv")
    out_path = os.path.join(os.path.dirname(__file__), "Data", "patient_doctor_filtered.csv")
    
    
    df = pd.read_csv(csv_path).copy()    
    if patient_col not in df.columns or doctor_col not in df.columns:
        raise ValueError(
            f"Could not find '{patient_col}' or '{doctor_col}' in columns: {df.columns}"
        )
    df = df[[patient_col, doctor_col]].rename(
        columns={patient_col: "patient", doctor_col: "doctor"}
    )

    tqdm.pandas(desc="Scrubbing")
    df["patient"] = df["patient"].progress_apply(scrub)
    df["doctor"] = df["doctor"].progress_apply(scrub)

    df["q_len"] = df["patient"].str.split().str.len()
    df["a_len"] = df["doctor"].str.split().str.len()
    df = df.query(
        "@min_q <= q_len <= @max_q and @min_a <= a_len <= @max_a"
    ).reset_index(drop=True)

    df = df.drop_duplicates(["patient", "doctor"]).reset_index(drop=True)


    def chunk_text(text: str, max_words: int) -> list[str]:
        words = text.split()
        return [" ".join(words[i : i + max_words]) for i in range(0, len(words), max_words)]

    rows: list[dict[str, str]] = []
    for _, row in df.iterrows():
        q_chunks = chunk_text(row["patient"], 200)
        a_chunks = chunk_text(row["doctor"], 250)
        for qc, ac in zip(q_chunks, a_chunks):
            rows.append({"patient": qc, "doctor": ac})

    clean_df = pd.DataFrame(rows)
    out_path = Path(out_path)
    clean_df.to_csv(out_path, index=False)
    print(f"✅ Saved {len(clean_df)} cleaned Q‑A pairs → {out_path}")


if __name__ == "__main__":
    filter_chat_csv()



