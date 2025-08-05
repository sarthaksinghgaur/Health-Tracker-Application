from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import users_db, meals_db
from .models import MealLog, StatusResponse, User, WebhookPayload
from .services import calc_bmr, sum_nutrients, parse_webhook

app = FastAPI(title="Professional Health Tracker")

origins = ["http://127.0.0.1:5500", "http://localhost:5500"]
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
    return {"message": "registered"}


@app.post("/log_meals")
def log_meals(meal: MealLog):
    if meal.username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    totals = sum_nutrients(meal.items)
    entry = meal.dict()
    entry.update(totals)
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
