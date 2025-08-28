# Health Tracker Application

A health tracking application with user authentication, meal logging, and nutrition analytics.

## Project Structure

```
Spano-Assessment-Round/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI endpoints
│   │   ├── models.py        # Pydantic models
│   │   ├── services.py      # Business logic
│   │   └── db.py           # In-memory database
│   ├── tests/
│   │   └── test_endpoints.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── index.html          # Dashboard
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── landing.html        # Welcome page
│   ├── css/
│   │   └── style.css       # Styles
│   └── js/
│       ├── main.js         # Dashboard logic
│       ├── auth.js         # Authentication
│       ├── api.js          # API calls
│       └── ui.js           # UI functions
└── README.md
```

## How to Run

#### Backend Only
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
Backend runs on: `http://127.0.0.1:8000`

#### Frontend Only
```bash
cd frontend && live-server
```
Frontend runs on: `http://127.0.0.1:8080`

## API Testing

### Register User
```bash
curl -X POST http://127.0.0.1:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "age": 25,
    "gender": "male",
    "weight_kg": 70,
    "height_cm": 175
  }'
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Log Meal
```bash
curl -X POST http://127.0.0.1:8000/log_meals \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "meal_type": "lunch",
    "items": [
      {"name": "apple", "quantity": 1}
    ]
  }'
```

### Get Daily Status
```bash
curl http://127.0.0.1:8000/status/testuser
```

### Get Meal History
```bash
curl http://127.0.0.1:8000/meals/testuser
```

## Available Food Items

The following food items are available in the database with their nutritional values:

### Fruits
- apple (52 kcal, 0.3g protein, 14g carbs, 0.2g fat)
- banana (89 kcal, 1.1g protein, 23g carbs, 0.3g fat)
- orange (47 kcal, 0.9g protein, 12g carbs, 0.1g fat)
- strawberry (32 kcal, 0.7g protein, 8g carbs, 0.3g fat)
- grape (62 kcal, 0.6g protein, 16g carbs, 0.2g fat)

### Vegetables
- broccoli (34 kcal, 2.8g protein, 7g carbs, 0.4g fat)
- spinach (23 kcal, 2.9g protein, 3.6g carbs, 0.4g fat)
- carrot (41 kcal, 0.9g protein, 10g carbs, 0.2g fat)
- tomato (18 kcal, 0.9g protein, 3.9g carbs, 0.2g fat)
- cucumber (16 kcal, 0.7g protein, 3.6g carbs, 0.1g fat)

### Proteins
- chicken breast (165 kcal, 31g protein, 0g carbs, 3.6g fat)
- salmon (208 kcal, 25g protein, 0g carbs, 12g fat)
- eggs (155 kcal, 13g protein, 1.1g carbs, 11g fat)
- tofu (76 kcal, 8g protein, 1.9g carbs, 4.8g fat)
- beef (250 kcal, 26g protein, 0g carbs, 15g fat)

### Grains
- rice (130 kcal, 2.7g protein, 28g carbs, 0.3g fat)
- bread (265 kcal, 9g protein, 49g carbs, 3.2g fat)
- pasta (131 kcal, 5g protein, 25g carbs, 1.1g fat)
- oatmeal (68 kcal, 2.4g protein, 12g carbs, 1.4g fat)
- quinoa (120 kcal, 4.4g protein, 22g carbs, 1.9g fat)

### Dairy
- milk (42 kcal, 3.4g protein, 5g carbs, 1g fat)
- yogurt (59 kcal, 10g protein, 3.6g carbs, 0.4g fat)
- cheese (113 kcal, 7g protein, 0.4g carbs, 9g fat)
- butter (717 kcal, 0.9g protein, 0.1g carbs, 81g fat)

### Snacks
- nuts (607 kcal, 20g protein, 21g carbs, 54g fat)
- chips (536 kcal, 7g protein, 53g carbs, 35g fat)
- chocolate (545 kcal, 4.9g protein, 61g carbs, 31g fat)
- popcorn (375 kcal, 11g protein, 74g carbs, 4g fat)

### Beverages
- coffee (2 kcal, 0.3g protein, 0g carbs, 0g fat)
- tea (1 kcal, 0g protein, 0.2g carbs, 0g fat)
- juice (54 kcal, 0.5g protein, 13g carbs, 0.1g fat)
- soda (42 kcal, 0g protein, 11g carbs, 0g fat)

## Features

- User registration and authentication
- Meal logging with nutritional tracking
- Daily calorie and nutrition overview
- Meal history and analytics
- Responsive web interface
- Dark/light theme toggle

## Technology Stack

- **Backend**: FastAPI, Python
- **Frontend**: HTML, CSS, JavaScript
- **Database**: In-memory storage
