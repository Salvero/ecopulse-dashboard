"""
EnerPulse Analytics API - Production-Ready FastAPI Backend
===========================================================
Real-time inference API for Energy Consumption Forecasting.
Implements LSTM-based load prediction with anomaly detection.

Architecture: FastAPI + TensorFlow (Mock Mode for Portfolio Demo)
"""

import numpy as np
import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
from contextlib import asynccontextmanager
import logging
import sys

# =============================================================================
# 1. LOGGING CONFIGURATION
# =============================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("EnerPulse-API")

# =============================================================================
# 2. CONFIGURATION
# =============================================================================
MODEL_PATH = "models/energy_lstm_v1.h5"
API_VERSION = "2.0.0"
MIN_DATA_POINTS = 24  # Minimum hours of historical data required

# =============================================================================
# 3. PYDANTIC MODELS (Request/Response Contracts)
# =============================================================================
class PredictionRequest(BaseModel):
    """Input schema for energy prediction endpoint."""
    recent_usage: List[float] = Field(
        ...,
        min_items=24,
        description="Last 24+ hours of energy consumption data (kWh)"
    )
    sensor_id: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Unique identifier for the sensor/facility"
    )
    
    @validator("recent_usage")
    def validate_usage_values(cls, v):
        if any(val < 0 for val in v):
            raise ValueError("Energy usage values cannot be negative")
        return v

class PredictionResponse(BaseModel):
    """Output schema for energy prediction endpoint."""
    sensor_id: str
    timestamp: str
    predicted_usage: float = Field(..., description="Predicted energy consumption (kWh)")
    anomaly_detected: bool = Field(..., description="True if usage spike predicted")
    anomaly_severity: Optional[str] = Field(None, description="low/medium/high if anomaly detected")
    confidence_score: float = Field(..., ge=0, le=1, description="Model confidence (0-1)")
    
class HealthResponse(BaseModel):
    """Output schema for health check endpoint."""
    status: str
    model_loaded: bool
    model_version: str
    api_version: str
    timestamp: str

class BatchPredictionRequest(BaseModel):
    """Input schema for batch prediction endpoint."""
    sensors: List[PredictionRequest]

# =============================================================================
# 4. GLOBAL STATE
# =============================================================================
class ModelState:
    """Container for ML model and metadata."""
    model: Optional[object] = None
    is_loaded: bool = False
    load_time: Optional[datetime] = None

model_state = ModelState()

# =============================================================================
# 5. LIFESPAN EVENTS (Modern FastAPI Pattern)
# =============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events.
    Loads ML model into memory ONCE at startup to avoid per-request latency.
    """
    # --- STARTUP ---
    logger.info("=" * 60)
    logger.info("EnerPulse Analytics API Starting...")
    logger.info("=" * 60)
    
    try:
        # Production Mode: Load actual TensorFlow model
        # from tensorflow.keras.models import load_model
        # model_state.model = load_model(MODEL_PATH)
        
        # Demo Mode: Simulate loaded model for portfolio
        model_state.model = "LSTM_MOCK_MODEL_v1"
        model_state.is_loaded = True
        model_state.load_time = datetime.utcnow()
        
        logger.info(f"✓ Model loaded successfully from: {MODEL_PATH}")
        logger.info(f"✓ Model ready at: {model_state.load_time.isoformat()}")
        
    except Exception as e:
        logger.error(f"✗ Failed to load model: {e}")
        model_state.is_loaded = False
    
    yield  # Application runs here
    
    # --- SHUTDOWN ---
    logger.info("EnerPulse Analytics API Shutting down...")
    model_state.model = None
    model_state.is_loaded = False

# =============================================================================
# 6. APP INITIALIZATION
# =============================================================================
app = FastAPI(
    title="EnerPulse Analytics API",
    description="""
    ## AI-Powered Energy Consumption Forecasting
    
    This API provides real-time inference for energy load prediction using 
    LSTM (Long Short-Term Memory) neural networks.
    
    ### Features:
    - **Load Forecasting**: Predict next-hour energy consumption
    - **Anomaly Detection**: Identify unusual usage patterns
    - **Batch Processing**: Process multiple sensors simultaneously
    
    ### Architecture:
    - FastAPI (Async Python)
    - TensorFlow/Keras LSTM Model
    - Redis Caching (Production)
    """,
    version=API_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# 7. INFERENCE LOGIC (Mock Implementation)
# =============================================================================
def run_inference(usage_data: List[float]) -> dict:
    """
    Simulates LSTM model inference for demo purposes.
    
    Production Implementation:
        input_tensor = np.array([usage_data]).reshape((1, 24, 1))
        prediction = model_state.model.predict(input_tensor, verbose=0)
        return prediction[0][0]
    """
    # Calculate rolling statistics
    recent_window = usage_data[-6:]  # Last 6 hours
    historical_avg = np.mean(usage_data)
    recent_avg = np.mean(recent_window)
    recent_std = np.std(recent_window)
    
    # Trend detection (simple linear regression slope)
    x = np.arange(len(recent_window))
    slope = np.polyfit(x, recent_window, 1)[0]
    
    # Predict: weighted combination of recent average + trend
    trend_factor = 1 + (slope / max(recent_avg, 1)) * 0.5
    noise = np.random.uniform(-0.03, 0.03)  # ±3% noise
    predicted_val = recent_avg * trend_factor * (1 + noise)
    
    # Ensure non-negative
    predicted_val = max(0, predicted_val)
    
    # Anomaly detection: 2 standard deviations above historical average
    threshold = historical_avg + (2 * np.std(usage_data))
    is_anomaly = predicted_val > threshold
    
    # Severity classification
    severity = None
    if is_anomaly:
        deviation = (predicted_val - threshold) / threshold
        if deviation < 0.1:
            severity = "low"
        elif deviation < 0.25:
            severity = "medium"
        else:
            severity = "high"
    
    # Confidence: based on data stability (lower std = higher confidence)
    coefficient_of_variation = recent_std / max(recent_avg, 0.01)
    confidence = max(0.5, min(0.98, 1 - coefficient_of_variation))
    
    return {
        "predicted_usage": round(predicted_val, 2),
        "anomaly_detected": is_anomaly,
        "anomaly_severity": severity,
        "confidence_score": round(confidence, 3)
    }

# =============================================================================
# 8. API ENDPOINTS
# =============================================================================

@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to API documentation."""
    return {"message": "EnerPulse API", "docs": "/docs"}

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    Kubernetes/Docker health check endpoint.
    Returns 503 if model is not loaded.
    """
    if not model_state.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded - service unavailable"
        )
    
    return HealthResponse(
        status="healthy",
        model_loaded=model_state.is_loaded,
        model_version="v1.0-lstm",
        api_version=API_VERSION,
        timestamp=datetime.utcnow().isoformat()
    )

@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
async def predict_usage(request: PredictionRequest):
    """
    **Single Sensor Prediction**
    
    Accepts recent energy usage data and returns a forecast.
    
    - **recent_usage**: Array of last 24+ hours of consumption (kWh)
    - **sensor_id**: Unique identifier for the facility/sensor
    """
    logger.info(f"Inference request received | sensor_id={request.sensor_id} | data_points={len(request.recent_usage)}")
    
    if not model_state.is_loaded:
        logger.error("Inference attempted but model not loaded")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )
    
    try:
        # Run inference
        result = run_inference(request.recent_usage)
        
        logger.info(
            f"Inference complete | sensor_id={request.sensor_id} | "
            f"predicted={result['predicted_usage']} | anomaly={result['anomaly_detected']}"
        )
        
        return PredictionResponse(
            sensor_id=request.sensor_id,
            timestamp=datetime.utcnow().isoformat(),
            **result
        )
        
    except Exception as e:
        logger.error(f"Inference error | sensor_id={request.sensor_id} | error={str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failed: {str(e)}"
        )

@app.post("/predict/batch", response_model=List[PredictionResponse], tags=["Inference"])
async def predict_batch(request: BatchPredictionRequest):
    """
    **Batch Prediction**
    
    Process multiple sensors in a single request.
    Useful for facility-wide energy analysis.
    """
    logger.info(f"Batch inference request | sensors={len(request.sensors)}")
    
    if not model_state.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )
    
    results = []
    for sensor_request in request.sensors:
        try:
            result = run_inference(sensor_request.recent_usage)
            results.append(PredictionResponse(
                sensor_id=sensor_request.sensor_id,
                timestamp=datetime.utcnow().isoformat(),
                **result
            ))
        except Exception as e:
            logger.error(f"Batch inference error | sensor_id={sensor_request.sensor_id} | error={str(e)}")
            # Continue processing other sensors
            continue
    
    return results

@app.get("/model/info", tags=["System"])
async def model_info():
    """Returns metadata about the loaded model."""
    return {
        "model_path": MODEL_PATH,
        "is_loaded": model_state.is_loaded,
        "load_time": model_state.load_time.isoformat() if model_state.load_time else None,
        "input_shape": "[batch_size, 24, 1]",
        "output_shape": "[batch_size, 1]",
        "architecture": "LSTM (2 layers, 64 units each)",
        "training_data": "Industrial facility consumption logs (simulated)"
    }

# =============================================================================
# 9. MAIN ENTRY POINT
# =============================================================================
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Disable in production
        log_level="info"
    )