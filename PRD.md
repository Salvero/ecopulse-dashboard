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

### ✅ Completed (Dec 10, 2024)

| Component | Status | Notes |
| :--- | :--- | :--- |
| **Frontend Dashboard** | ✅ Complete | Next.js 16, Recharts, TailwindCSS. Deployed to Netlify. |
| **Backend API** | ✅ Complete | FastAPI with mock LSTM inference, CORS, batch processing. |
| **Docker Setup** | ✅ Complete | Multi-stage Dockerfile + docker-compose.yml |
| **PRD & README** | ✅ Complete | Documentation aligned with full-stack architecture. |
| **Frontend-Backend Integration** | ✅ Complete | React hooks connected to `/predict` API endpoint. |
| **WebSocket Live Telemetry** | ✅ Complete | Real-time streaming via `/ws/stream` endpoint. |

### 🔜 Next Steps

1. **Train Real LSTM Model** - Create `train_model.py` script to generate `.h5` file from sample data.
2. **Redis Caching** - Uncomment and configure Redis service in docker-compose.
3. **CI/CD Pipeline** - Add GitHub Actions for automated testing and Docker builds.

---

## 10. Technical Deep Dive: WebSocket Live Telemetry

*Use this section to explain the feature in interviews.*

### 10.1 The 30-Second Pitch
> "I built a real-time monitoring dashboard that streams live sensor data from the backend to the frontend. Instead of the user constantly refreshing the page to see new data, the server **pushes** updates every second automatically using WebSockets. This is the same technology used in Slack, Discord, and stock trading platforms."

### 10.2 Why WebSocket Instead of REST API?

| Approach | How it works | Latency | Use Case |
|----------|--------------|---------|----------|
| **REST Polling** | Client asks "any new data?" every X seconds | High (request overhead) | Low-frequency updates |
| **WebSocket** | Server pushes data instantly when available | Low (~50ms) | Real-time dashboards, chat, games |

### 10.3 Implementation Details

**Backend** (`backend/main.py`):
* `ConnectionManager` class to track active WebSocket clients
* `/ws/stream` endpoint that upgrades HTTP → WebSocket
* Async loop generating and sending telemetry every 1 second

**Frontend** (`hooks/useWebSocket.ts`):
* Custom React hook with connection state management
* Auto-reconnect logic (5 retries with 3-second intervals)
* Data history buffer for charting (last 60 data points)

**Visualization** (`components/dashboard/LiveTelemetryChart.tsx`):
* Real-time Recharts graph that appends new data points
* Live status indicator with connect/disconnect controls
* Anomaly detection alerts

### 10.4 Key Interview Talking Points

1. **Demonstrates full-stack skills** — Backend WebSocket server + Frontend consumer
2. **Production patterns** — Connection manager, auto-reconnect, graceful error handling
3. **Real-time systems knowledge** — Understanding when to use WebSocket vs REST
4. **UX focus** — Live status badges, connection controls, streaming charts