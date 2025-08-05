# Professional Health Tracker

A full-stack health tracking application built with **FastAPI** on the backend and **vanilla HTML/CSS/JavaScript** on the frontend. The project demonstrates a clean separation between server and client and showcases modern practices such as module-based JavaScript, responsive design with theme toggling, and comprehensive API tests.

## Project Structure
```
professional_health_tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── services.py
│   │   └── db.py
│   ├── tests/
│   │   └── test_endpoints.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── api.js
│       └── ui.js
├── .gitignore
├── README.md
└── package.json
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+

Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```

Install frontend tooling:
```bash
npm install
```

### Run both applications concurrently
```bash
npm run dev
```
This starts the FastAPI backend on `http://127.0.0.1:8000` and serves the frontend via `live-server`.

## API Documentation

### Register User
```bash
curl -X POST http://127.0.0.1:8000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","age":30,"gender":"female","weight_kg":65,"height_cm":170}'
```

### Log Meal
```bash
curl -X POST http://127.0.0.1:8000/log_meals \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","meal_type":"lunch","items":[{"name":"apple","quantity":1}]}'
```

### Get Daily Status
```bash
curl http://127.0.0.1:8000/status/alice
```

### Webhook Logging
```bash
curl -X POST http://127.0.0.1:8000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message":"alice|dinner|rice:1"}'
```

## Tests

Run backend tests with pytest:
```bash
cd backend
pytest
```

## Architecture Notes
- **Backend:** FastAPI with in-memory storage. Services encapsulate business logic like BMR calculation and webhook parsing.
- **Frontend:** Vanilla JS with ES modules. `main.js` orchestrates state and events, `api.js` handles network calls, and `ui.js` manages DOM updates and theme toggling.
