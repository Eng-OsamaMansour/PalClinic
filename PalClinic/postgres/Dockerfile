# postgres/Dockerfile
#
# Builds a Postgres 15 image that already has BOTH PostGIS 3.3
# and the pgvector extension pre-installed.

FROM postgis/postgis:15-3.3          
# ── install pgvector Debian package ─────────────────────────────
RUN apt-get update && \
    apt-get install -y postgresql-15-pgvector && \
    rm -rf /var/lib/apt/lists/*

# ── auto-enable the extension the first time the cluster starts ─
COPY init/ /docker-entrypoint-initdb.d/
