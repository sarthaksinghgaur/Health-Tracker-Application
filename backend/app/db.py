from typing import Dict, List

# In-memory storage for users and meals
users_db: Dict[str, dict] = {}
meals_db: Dict[str, List[dict]] = {}

# Static food database with nutrient information per serving
food_db: Dict[str, Dict[str, float]] = {
    "apple": {"calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3},
    "banana": {"calories": 105, "protein": 1.3, "carbs": 27, "fat": 0.4},
    "chicken breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "rice": {"calories": 206, "protein": 4.3, "carbs": 45, "fat": 0.4},
}
