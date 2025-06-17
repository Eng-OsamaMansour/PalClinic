# Base Python image
FROM python:3.11-slim

# ── environment ────────────────────────────────────────────────
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ── system deps for GeoDjango + psycopg2 + GDAL ────────────────
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    gcc \
    g++ \
    libpq-dev \        
    netcat-openbsd \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/

# GDAL headers
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV GDAL_VERSION=3.6.0

# ── project code ───────────────────────────────────────────────
WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
    pip install sacremoses

COPY . .

EXPOSE 8000
CMD ["gunicorn", "PalClinic.wsgi:application", "--bind", "0.0.0.0:8000"]
