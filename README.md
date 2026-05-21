# InsureGuard — AI-Powered Insurance Fraud Detection System

A full-stack web application that detects fraudulent insurance claims in real time using rule-based scoring logic.

- **Backend** — Java 17 + Spring Boot 3 (hosted on [Railway](https://railway.app))
- **Frontend** — React 18 + Vite + Tailwind CSS (hosted on [Vercel](https://vercel.com))
- **Storage** — In-memory `ConcurrentHashMap` (no database required)

---

## Project Structure

```
insurance-fraud-detection/
├── backend/     ← Spring Boot REST API
└── frontend/    ← React + Vite web app
```

---

## Fraud Detection Rules

| Rule | Score |
|---|---|
| Claim amount > ₹5,00,000 | +30 |
| Missing / blank policy number | +20 |
| Same hospital has 3+ existing claims | +15 |
| Same policy submitted within 1 hour | +35 |

**Fraud Levels:** 0–30 = LOW RISK · 31–60 = MEDIUM RISK · 61–100 = HIGH RISK

---

## Running Locally

### Backend

```bash
cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local     # edit VITE_API_URL if needed
npm run dev
# App available at http://localhost:5173
```

---

## API Reference

### User APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/claim/submit` | Submit a new insurance claim |
| GET | `/claim/{claimId}` | Get claim status by ID |

### Admin APIs (requires `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/login` | Admin login (returns token) |
| GET | `/admin/claims` | List all claims |
| GET | `/admin/claims/{claimId}` | Get claim by ID |
| PUT | `/admin/approve/{claimId}` | Approve a claim |
| PUT | `/admin/reject/{claimId}` | Reject a claim |
| PUT | `/admin/investigate/{claimId}` | Flag for investigation |

### Example — Submit Claim
```json
POST /claim/submit
{
  "customerName": "Rajesh Kumar",
  "policyNumber": "HDFC-LIF-2024-00123",
  "claimAmount": 650000,
  "hospitalName": "Apollo Hospital",
  "incidentType": "Surgery"
}
```

### Example — Response
```json
{
  "claimId": "CLM1001",
  "fraudScore": 30,
  "fraudLevel": "LOW_RISK",
  "status": "APPROVED",
  "message": "Claim submitted successfully"
}
```

---

## Deploying to Railway (Backend)

1. Push `backend/` folder to a GitHub repository
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
3. Select the repository and set root directory to `backend`
4. Railway auto-detects Spring Boot via `pom.xml`
5. Add environment variables in Railway dashboard:

| Variable | Value |
|---|---|
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` |

6. Copy the generated Railway URL (e.g. `https://your-app.up.railway.app`)

---

## Deploying to Vercel (Frontend)

1. Push `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project → Import Git Repository**
3. Select the repository, set **Root Directory** to `frontend`
4. Add environment variable in Vercel project settings:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-app.up.railway.app` |

5. Click **Deploy**

---

## Admin Credentials

| Username | Password |
|---|---|
| `admin` | `1234` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Language | Java 17 |
| Backend Framework | Spring Boot 3.2 |
| Build Tool | Maven |
| In-Memory Store | ConcurrentHashMap |
| Frontend Framework | React 18 |
| Frontend Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Backend Hosting | Railway |
| Frontend Hosting | Vercel |
