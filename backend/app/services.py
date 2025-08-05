from typing import List, Dict

from .db import food_db, meals_db
from .models import MealItem, MealLog, User, Gender, WebhookPayload


def calc_bmr(user: User) -> float:
    """Calculate Basal Metabolic Rate using the Mifflin-St Jeor Equation."""
    if user.gender == Gender.male:
        return 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age + 5
    return 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age - 161


def sum_nutrients(items: List[MealItem]) -> Dict[str, float]:
    totals = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    for item in items:
        data = food_db.get(item.name.lower())
        if not data:
            continue
        for key in totals:
            totals[key] += data[key] * item.quantity
    return totals


def parse_webhook(payload: WebhookPayload) -> MealLog:
    """Parse a simple webhook message into a MealLog.

    Expected format: "username|meal_type|food:qty,food:qty"
    Example: "alice|lunch|apple:1,banana:2"
    """
    parts = payload.message.split("|")
    if len(parts) != 3:
        raise ValueError("Invalid message format")
    username, meal_type, items_str = parts
    items = []
    for piece in items_str.split(","):
        if ":" not in piece:
            continue
        name, qty = piece.split(":")
        items.append(MealItem(name=name.strip(), quantity=float(qty)))
    return MealLog(username=username, meal_type=meal_type, items=items)
