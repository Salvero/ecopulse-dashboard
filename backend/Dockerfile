# ==============================================================================
# EnerPulse Analytics API - Dockerfile
# ==============================================================================
# Lightweight production container for the FastAPI inference server.
# Uses multi-stage build pattern for minimal image size.
#
# Build:  docker build -t enerpulse-api:latest .
# Run:    docker run -p 8000:8000 enerpulse-api:latest
# ==============================================================================

FROM python:3.9-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory
WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ==============================================================================
# Dependencies Stage
# ==============================================================================
FROM base AS dependencies

# Copy requirements first (leverages Docker cache)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ==============================================================================
# Production Stage
# ==============================================================================
FROM dependencies AS production

# Create non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy application code
COPY --chown=appuser:appgroup . .

# Create models directory (for .h5 files)
RUN mkdir -p models && chown appuser:appgroup models

# Switch to non-root user
USER appuser

# Expose the API port
EXPOSE 8000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]

# ==============================================================================
# Development Stage (optional - for local development)
# ==============================================================================
FROM dependencies AS development

COPY . .

# Enable hot-reload for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
