from enum import Enum
from typing import List

from pydantic import BaseModel


class Gender(str, Enum):
    male = "male"
    female = "female"


class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"


class User(BaseModel):
    username: str
    password: str
    age: int
    gender: Gender
    weight_kg: float
    height_cm: float


class MealItem(BaseModel):
    name: str
    quantity: float = 1


class MealLog(BaseModel):
    username: str
    meal_type: MealType
    items: List[MealItem]


class StatusResponse(BaseModel):
    bmr: float
    calories_consumed: float
    calories_remaining: float
    protein: float
    carbs: float
    fat: float


class LoginRequest(BaseModel):
    username: str
    password: str
    remember: bool = False


class WebhookPayload(BaseModel):
    message: str
