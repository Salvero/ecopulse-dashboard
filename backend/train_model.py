"""
EcoPulse LSTM Model Training Script
====================================
Generates synthetic energy consumption data and trains an LSTM model
for next-hour energy usage prediction.

Usage:
    python train_model.py

Output:
    models/energy_lstm_v1.h5 - Trained Keras model
    models/training_history.json - Training metrics
"""

import numpy as np
import pandas as pd
import json
import os
from datetime import datetime, timedelta

# TensorFlow imports
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TF warnings
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# =============================================================================
# 1. CONFIGURATION
# =============================================================================
SEQUENCE_LENGTH = 24  # Hours of historical data to use
PREDICTION_HORIZON = 1  # Predict next 1 hour
TRAIN_DAYS = 365  # 1 year of synthetic data
VALIDATION_SPLIT = 0.2
BATCH_SIZE = 32
EPOCHS = 50
MODEL_OUTPUT_PATH = "models/energy_lstm_v1.h5"

print("=" * 60)
print("EcoPulse LSTM Model Training")
print("=" * 60)

# =============================================================================
# 2. SYNTHETIC DATA GENERATION
# =============================================================================
def generate_synthetic_data(num_days: int = 365) -> pd.DataFrame:
    """
    Generates realistic synthetic energy consumption data.
    Incorporates:
    - Daily patterns (higher usage during business hours)
    - Weekly patterns (lower on weekends)
    - Seasonal patterns (higher in summer/winter for HVAC)
    - Random noise and occasional spikes
    """
    print(f"\n📊 Generating {num_days} days of synthetic energy data...")
    
    np.random.seed(42)
    hours = num_days * 24
    timestamps = [datetime(2024, 1, 1) + timedelta(hours=i) for i in range(hours)]
    
    data = []
    base_load = 150  # Base kWh
    
    for i, ts in enumerate(timestamps):
        hour = ts.hour
        day_of_week = ts.weekday()
        day_of_year = ts.timetuple().tm_yday
        
        # Hourly pattern (business hours = higher usage)
        if 9 <= hour <= 17:
            hourly_factor = 1.5
        elif 18 <= hour <= 21:
            hourly_factor = 1.2
        elif 0 <= hour <= 5:
            hourly_factor = 0.6
        else:
            hourly_factor = 1.0
        
        # Weekly pattern (weekends = lower usage)
        if day_of_week >= 5:
            weekly_factor = 0.7
        else:
            weekly_factor = 1.0
        
        # Seasonal pattern (summer & winter peak for HVAC)
        # Peaks in Jan/Jul, lowest in Apr/Oct
        seasonal_factor = 1 + 0.2 * np.cos(2 * np.pi * (day_of_year - 15) / 365)
        
        # Calculate usage
        usage = base_load * hourly_factor * weekly_factor * seasonal_factor
        
        # Add noise (±10%)
        noise = np.random.uniform(-0.1, 0.1) * usage
        usage += noise
        
        # Random spikes (2% chance of 50-100% spike)
        if np.random.random() < 0.02:
            usage *= np.random.uniform(1.5, 2.0)
        
        data.append({
            'timestamp': ts,
            'usage_kwh': round(usage, 2),
            'hour': hour,
            'day_of_week': day_of_week,
            'is_weekend': day_of_week >= 5,
            'is_spike': usage > base_load * 1.8
        })
    
    df = pd.DataFrame(data)
    print(f"✓ Generated {len(df)} hourly data points")
    print(f"  - Mean usage: {df['usage_kwh'].mean():.2f} kWh")
    print(f"  - Max usage: {df['usage_kwh'].max():.2f} kWh")
    print(f"  - Spike events: {df['is_spike'].sum()}")
    
    return df

# =============================================================================
# 3. DATA PREPROCESSING
# =============================================================================
def create_sequences(data: np.ndarray, seq_length: int = 24) -> tuple:
    """
    Creates sliding window sequences for LSTM training.
    X: (samples, seq_length, 1) - Input sequences
    y: (samples, 1) - Target values (next hour)
    """
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i + seq_length])
        y.append(data[i + seq_length])
    return np.array(X), np.array(y)

def preprocess_data(df: pd.DataFrame) -> tuple:
    """
    Normalize data and create train/validation splits.
    """
    print("\n🔧 Preprocessing data...")
    
    # Extract usage values
    usage = df['usage_kwh'].values.astype(np.float32)
    
    # Normalize to [0, 1] range
    usage_min = usage.min()
    usage_max = usage.max()
    usage_normalized = (usage - usage_min) / (usage_max - usage_min)
    
    # Create sequences
    X, y = create_sequences(usage_normalized, SEQUENCE_LENGTH)
    
    # Reshape for LSTM: (samples, timesteps, features)
    X = X.reshape((X.shape[0], X.shape[1], 1))
    
    # Train/validation split (time-based, not random)
    split_idx = int(len(X) * (1 - VALIDATION_SPLIT))
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]
    
    print(f"✓ Created {len(X)} sequences of length {SEQUENCE_LENGTH}")
    print(f"  - Training samples: {len(X_train)}")
    print(f"  - Validation samples: {len(X_val)}")
    
    return X_train, X_val, y_train, y_val, usage_min, usage_max

# =============================================================================
# 4. MODEL ARCHITECTURE
# =============================================================================
def build_model(input_shape: tuple) -> Sequential:
    """
    Builds the LSTM model architecture.
    Architecture: LSTM(64) -> Dropout -> LSTM(32) -> Dropout -> Dense(1)
    """
    print("\n🧠 Building LSTM model...")
    
    model = Sequential([
        # First LSTM layer with return sequences for stacking
        LSTM(64, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        
        # Second LSTM layer
        LSTM(32, return_sequences=False),
        Dropout(0.2),
        
        # Output layer
        Dense(16, activation='relu'),
        Dense(1, activation='linear')
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae']
    )
    
    model.summary()
    return model

# =============================================================================
# 5. TRAINING
# =============================================================================
def train_model(model: Sequential, X_train, X_val, y_train, y_val) -> dict:
    """
    Trains the model with early stopping and checkpointing.
    """
    print("\n🚀 Starting training...")
    
    # Ensure models directory exists
    os.makedirs("models", exist_ok=True)
    
    # Callbacks
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ModelCheckpoint(
            MODEL_OUTPUT_PATH,
            monitor='val_loss',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Train
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=1
    )
    
    return history.history

# =============================================================================
# 6. EVALUATION
# =============================================================================
def evaluate_model(model: Sequential, X_val, y_val, usage_min, usage_max) -> dict:
    """
    Evaluates model performance and calculates MAPE.
    """
    print("\n📈 Evaluating model...")
    
    # Predict
    y_pred = model.predict(X_val, verbose=0)
    
    # Denormalize for MAPE calculation
    y_val_actual = y_val * (usage_max - usage_min) + usage_min
    y_pred_actual = y_pred.flatten() * (usage_max - usage_min) + usage_min
    
    # Calculate MAPE
    mape = np.mean(np.abs((y_val_actual - y_pred_actual) / y_val_actual)) * 100
    mae = np.mean(np.abs(y_val_actual - y_pred_actual))
    rmse = np.sqrt(np.mean((y_val_actual - y_pred_actual) ** 2))
    
    print(f"\n{'=' * 40}")
    print("📊 Model Performance Metrics")
    print(f"{'=' * 40}")
    print(f"  MAPE: {mape:.2f}%")
    print(f"  MAE:  {mae:.2f} kWh")
    print(f"  RMSE: {rmse:.2f} kWh")
    print(f"{'=' * 40}")
    
    return {
        "mape": float(round(mape, 2)),
        "mae": float(round(mae, 2)),
        "rmse": float(round(rmse, 2)),
        "usage_min": float(usage_min),
        "usage_max": float(usage_max)
    }

# =============================================================================
# 7. MAIN EXECUTION
# =============================================================================
def main():
    # Generate data
    df = generate_synthetic_data(TRAIN_DAYS)
    
    # Preprocess
    X_train, X_val, y_train, y_val, usage_min, usage_max = preprocess_data(df)
    
    # Build model
    model = build_model(input_shape=(SEQUENCE_LENGTH, 1))
    
    # Train
    history = train_model(model, X_train, X_val, y_train, y_val)
    
    # Evaluate
    metrics = evaluate_model(model, X_val, y_val, usage_min, usage_max)
    
    # Save training history and metadata
    training_info = {
        "trained_at": datetime.now().isoformat(),
        "sequence_length": SEQUENCE_LENGTH,
        "train_samples": len(X_train),
        "val_samples": len(X_val),
        "epochs_completed": len(history['loss']),
        "final_train_loss": float(history['loss'][-1]),
        "final_val_loss": float(history['val_loss'][-1]),
        "metrics": metrics
    }
    
    with open("models/training_history.json", "w") as f:
        json.dump(training_info, f, indent=2)
    
    print(f"\n✅ Model saved to: {MODEL_OUTPUT_PATH}")
    print(f"✅ Training info saved to: models/training_history.json")
    print("\n🎉 Training complete!")

if __name__ == "__main__":
    main()
