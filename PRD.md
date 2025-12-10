# Product Requirements Document (PRD): EcoPulse - AI Energy Analytics Platform

| Document Details | |
| :--- | :--- |
| **Status** | Active / In-Development |
| **Version** | 2.0.0 (Full Stack Merge) |
| **Owner** | Salman Akram |
| **Target Role** | AI Engineer / Full-Stack SWE |

## 1. Executive Summary
**EcoPulse** is an intelligent energy monitoring platform that combines real-time data visualization with AI-driven forecasting. It allows industrial facility managers to monitor current power draw and receive alerts 24 hours in advance of predicted load spikes, enabling proactive cost saving.

## 2. Problem Statement
Industrial facilities often incur high "peak demand" charges because they react to energy spikes after they happen. Static dashboards show history but lack foresight. EcoPulse solves this by using an LSTM neural network to predict future usage.

## 3. User Personas
* **Facility Manager:** Needs a clean, "glanceable" dashboard to check grid health.
* **Data Engineer:** Needs access to the raw inference API and model latency metrics.

## 4. Technical Architecture & Stack
### 4.1 Frontend (EcoPulse)
* **Framework:** React 18 (TypeScript)
* **Visualization:** Recharts (High-performance canvas rendering)
* **State Management:** React Context + WebSocket Hooks
* **Hosting:** Netlify (CI/CD connected)

### 4.2 Backend (EnerPulse Engine)
* **API:** FastAPI (Python 3.9+) - Async implementation
* **ML Engine:** TensorFlow/Keras (LSTM Model)
* **Database:** TimescaleDB (PostgreSQL extension for time-series)
* **Caching:** Redis (Inference caching)
* **Containerization:** Docker & Docker Compose

## 5. Functional Requirements

### 5.1 Visualization & UI
* **FR-01:** Dashboard must render a "Live Telemetry" chart updating every second via WebSockets.
* **FR-02:** UI must include a "Grid Dependency" gauge that changes color based on predicted solar availability.
* **FR-03:** Users can toggle between "Live Stream" (WebSocket) and "Historical" (Rest API) views without page reload.

### 5.2 AI Forecasting Module
* **FR-04:** System runs inference on the last 24 hours of data to predict the next 1 hour of usage.
* **FR-05:** **Hybrid Deployment:**
    * *Production Mode:* Loads `.h5` model into memory for real-time inference.
    * *Demo Mode:* Uses pre-calculated JSON scenarios to ensure zero-latency for portfolio viewers.

## 6. Non-Functional Requirements (SLAs)
* **Latency:** Dashboard Time-to-Interactive (TTI) < 1.5s.
* **Inference Speed:** API response < 50ms (using Redis Cache).
* **Accuracy:** Model Validation MAPE < 5% on holdout dataset.

## 7. Success Metrics
* **System Stability:** Zero memory leaks in WebSocket connections over 24-hour runtime.
* **Optimization:** Frontend bundle size < 300KB (Gzipped).

## 8. Future Roadmap
* Integration with live Weather API to correlate cloud cover with solar output.
* Mobile-responsive view for field technicians.

---

## 9. Development Log

### ✅ Completed (Dec 9, 2024)

| Component | Status | Notes |
| :--- | :--- | :--- |
| **Frontend Dashboard** | ✅ Complete | Next.js 16, Recharts, TailwindCSS. Deployed to Netlify. |
| **Backend API** | ✅ Complete | FastAPI with mock LSTM inference, CORS, batch processing. |
| **Docker Setup** | ✅ Complete | Multi-stage Dockerfile + docker-compose.yml |
| **PRD & README** | ✅ Complete | Documentation aligned with full-stack architecture. |

### 🔜 Next Steps

1. **Train Real LSTM Model** - Create `train_model.py` script to generate `.h5` file from sample data.
2. **Add WebSocket Endpoint** - Implement `/ws/stream` for real-time telemetry.
3. **Redis Caching** - Uncomment and configure Redis service in docker-compose.
4. **Frontend Integration** - Connect dashboard to live `/predict` API endpoint.
5. **CI/CD Pipeline** - Add GitHub Actions for automated testing and Docker builds.