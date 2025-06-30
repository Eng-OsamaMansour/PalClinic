from __future__ import annotations

import os
import re
import uuid
from pathlib import Path
from typing import List, Tuple

import pandas as pd
from tqdm import tqdm

GREET_AR_RGX = re.compile(
    r"^\s*(?:"
    r"مرحبا|أهلا(?:ً|ً وسهلاً)?|السلام عليكم|سلام|"
    r"صباح الخير|مساء الخير|تحية طيبة|عزيزي|عزيزتي"
    r")[^\n]{0,60}\n?",
    flags=re.U,
)

CLOSE_AR_RGX = re.compile(
    r"(?:"
    r"مع ?تحياتي|تحياتي|"
    r"شكراً?(?: لك)?|دمتم بخير|دمت بخير|"
    r"أتمنى أن أكون قد أجبت(?: على)?(?: استفسارك| سؤالك)?|"
    r"يرجى إخباري إذا كنت بحاجة إلى مساعدة إضافية"
    r")[^\n]*?$",
    flags=re.U,
)

EMAIL_RGX  = re.compile(r"\b[\w.+-]+@\w+\.\w+\b", re.U)
PHONE_RGX  = re.compile(r"\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b", re.U)
NAME_FILL  = re.compile(r"\bX{2,}\b", re.U)

_ARABIC_TO_LATIN_DIGITS = str.maketrans(
    "٠١٢٣٤٥٦٧٨٩", "0123456789"
)

AGE_RGX_AR = re.compile(
    r"\b(\d{1,3})\s*"
    r"(?:سنة|سنوات|عام|أعوام|سنه|سنةً|عاماً)"
    r"(?:\s*من\s*العمر)?\b",
    flags=re.U,
)

EXTRA = re.compile(r"<end>", re.U)   # same as before

AGE_BINS: List[Tuple[int, int]] = [
    (0, 5), (5, 10), (10, 15), (15, 20),
    (20, 30), (30, 40), (40, 50), (50, 60),
    (60, 70), (70, 120),
]

def _age_bin(age: int) -> str:
    for lo, hi in AGE_BINS:
        if lo <= age < hi:
            return f"{lo}-{hi-1}" if hi < 120 else "70+"
    return "UNK"

def _normalise_digits(text: str) -> str:
    return text.translate(_ARABIC_TO_LATIN_DIGITS)

def scrub(text: str) -> str:
    txt = _normalise_digits(str(text))
    txt = txt.replace("<start>", "")           
    txt = EMAIL_RGX.sub("[EMAIL]", txt)
    txt = PHONE_RGX.sub("[PHONE]", txt)
    txt = NAME_FILL.sub("[NAME]", txt)
    txt = AGE_RGX_AR.sub(lambda m: f"[AGE:{_age_bin(int(m.group(1)))}]", txt)
    txt = GREET_AR_RGX.sub("", txt)
    txt = CLOSE_AR_RGX.sub("", txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    txt = EXTRA.sub("", txt)
    return txt


def filter_chat_csv_arabic():
    min_q, max_q = 10, 400
    min_a, max_a = 20, 500

    patient_col, doctor_col = "Patient", "Doctor"

    csv_path = os.path.join(os.path.dirname(__file__), "Data", "patient_doctor_ar.csv")
    out_path = os.path.join(os.path.dirname(__file__), "Data", "patient_doctor_ar_filtered.csv")

    df = pd.read_csv(csv_path)
    if patient_col not in df.columns or doctor_col not in df.columns:
        raise ValueError(
            f"Could not find '{patient_col}' or '{doctor_col}' in columns: {df.columns}"
        )

    df = df[[patient_col, doctor_col]].rename(
        columns={patient_col: "patient", doctor_col: "doctor"}
    )

    tqdm.pandas(desc="Scrubbing (Arabic)")
    df["patient"] = df["patient"].progress_apply(scrub)
    df["doctor"]  = df["doctor"].progress_apply(scrub)

    df["q_len"] = df["patient"].str.split().str.len()
    df["a_len"] = df["doctor"].str.split().str.len()
    df = df.query("@min_q <= q_len <= @max_q and @min_a <= a_len <= @max_a").reset_index(drop=True)

    df = df.drop_duplicates(["patient", "doctor"]).reset_index(drop=True)


    def _chunk(text: str, max_words: int) -> list[str]:
        words = text.split()
        return [" ".join(words[i:i + max_words]) for i in range(0, len(words), max_words)]

    rows = []
    for _, row in df.iterrows():
        q_chunks = _chunk(row["patient"], 200)
        a_chunks = _chunk(row["doctor"], 250)
        for qc, ac in zip(q_chunks, a_chunks):
            rows.append({"patient": qc, "doctor": ac})

    clean_df = pd.DataFrame(rows)
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    clean_df.to_csv(out_path, index=False)
    print(f"Saved {len(clean_df)} cleaned Arabic Q-A pairs → {out_path}")

if __name__ == "__main__":
    filter_chat_csv_arabic()
