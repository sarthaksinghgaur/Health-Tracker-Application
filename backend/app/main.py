from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import users_db, meals_db
from .models import MealLog, StatusResponse, User, WebhookPayload, LoginRequest
from .services import calc_bmr, sum_nutrients, parse_webhook

app = FastAPI(title="Professional Health Tracker")

origins = ["http://127.0.0.1:8080", "http://localhost:8080"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register")
def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.username] = user.dict()
    meals_db[user.username] = []
    
    # Remove password from response for security
    user_response = {k: v for k, v in user.dict().items() if k != 'password'}
    return {"message": "registered", "user": user_response}


@app.post("/login")
def login(login_data: LoginRequest):
    if login_data.username not in users_db:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    user_data = users_db[login_data.username]
    # In a real application, you would hash and verify passwords
    # For this demo, we'll just check if the password matches
    if user_data.get('password') != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Remove password from response for security
    user_response = {k: v for k, v in user_data.items() if k != 'password'}
    return {"message": "login successful", "user": user_response}


@app.post("/log_meals")
def log_meals(meal: MealLog):
    if meal.username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    totals = sum_nutrients(meal.items)
    entry = meal.dict()
    entry.update(totals)
    # Add timestamp
    from datetime import datetime
    entry["timestamp"] = datetime.now().isoformat()
    meals_db[meal.username].append(entry)
    return entry


@app.get("/meals/{username}")
def get_meals(username: str):
    if username not in meals_db:
        raise HTTPException(status_code=404, detail="User not found")
    return meals_db[username]


@app.get("/status/{username}", response_model=StatusResponse)
def status(username: str):
    user_data = users_db.get(username)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    user = User(**user_data)
    bmr = calc_bmr(user)
    totals = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    for meal in meals_db.get(username, []):
        for key in totals:
            totals[key] += meal.get(key, 0)
    remaining = bmr - totals["calories"]
    return StatusResponse(
        bmr=bmr,
        calories_consumed=totals["calories"],
        calories_remaining=remaining,
        protein=totals["protein"],
        carbs=totals["carbs"],
        fat=totals["fat"],
    )


@app.post("/webhook")
def webhook(payload: WebhookPayload):
    meal_log = parse_webhook(payload)
    return log_meals(meal_log)
