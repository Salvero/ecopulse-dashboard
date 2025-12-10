import numpy as np
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import logging

# Set up professional logging (Critical for SWE roles)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EnerPulse-API")

# --- 1. CONFIGURATION ---
MODEL_PATH = "models/energy_lstm_v1.h5"

# --- 2. DATA MODELS (Pydantic) ---
# Defines the contract for the API. Strict typing = Professional.
class PredictionRequest(BaseModel):
    # Expecting last 24 hours of data to predict the next hour
    recent_usage: List[float] 
    sensor_id: str

class PredictionResponse(BaseModel):
    sensor_id: str
    predicted_usage: float
    anomaly_detected: bool
    confidence_score: float

# --- 3. APP INITIALIZATION ---
app = FastAPI(
    title="EnerPulse Analytics API",
    description="Real-time inference API for Energy Consumption Forecasting",
    version="1.2.0"
)

# Global variable to hold the model
ai_model = None

# --- 4. LIFECYCLE EVENTS ---
@app.on_event("startup")
def load_model():
    """
    Loads the ML model into memory on server startup.
    This prevents loading lag on individual user requests.
    """
    global ai_model
    try:
        # In a real scenario, use: from tensorflow.keras.models import load_model
        # ai_model = load_model(MODEL_PATH)
        logger.info(f"Successfully loaded model from {MODEL_PATH}")
        
        # Simulating a loaded model object for this demo
        ai_model = "LOADED_MOCK_MODEL" 
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        # We don't crash the app, but log the critical error
        ai_model = None

# --- 5. ENDPOINTS ---

@app.get("/health")
def health_check():
    """Kubernetes/Docker health check endpoint."""
    if not ai_model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "healthy", "model_version": "v1.0"}

@app.post("/predict", response_model=PredictionResponse)
def predict_usage(request: PredictionRequest):
    """
    Inference endpoint: Accepts recent sensor data, returns forecast.
    """
    # Validation: Ensure we have enough data points (e.g., 24 hours)
    if len(request.recent_usage) < 24:
        raise HTTPException(status_code=400, detail="Insufficient data: Need last 24 hours.")

    try:
        # --- AI LOGIC SIMULATION ---
        # Real code: prediction = ai_model.predict(np.array([request.recent_usage]))
        
        # Mock logic for portfolio demo purposes:
        # Predict average of last 5 hours + random fluctuation
        recent_avg = np.mean(request.recent_usage[-5:])
        predicted_val = recent_avg * (1 + np.random.uniform(-0.05, 0.05))
        
        # Anomaly Logic: If prediction is > 20% higher than recent avg
        is_anomaly = predicted_val > (recent_avg * 1.2)
        
        return {
            "sensor_id": request.sensor_id,
            "predicted_usage": round(predicted_val, 2),
            "anomaly_detected": is_anomaly,
            "confidence_score": 0.92  # Example metric
        }

    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail="Internal Model Error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)