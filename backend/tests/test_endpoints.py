import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register_and_status():
    user = {
        "username": "alice",
        "age": 30,
        "gender": "female",
        "weight_kg": 65,
        "height_cm": 170,
    }
    resp = client.post("/register", json=user)
    assert resp.status_code == 200

    status_resp = client.get("/status/alice")
    assert status_resp.status_code == 200
    data = status_resp.json()
    assert "bmr" in data


def test_log_meals_and_get_meals():
    user = {
        "username": "bob",
        "age": 25,
        "gender": "male",
        "weight_kg": 80,
        "height_cm": 180,
    }
    client.post("/register", json=user)

    meal = {
        "username": "bob",
        "meal_type": "breakfast",
        "items": [{"name": "apple", "quantity": 1}, {"name": "banana", "quantity": 1}],
    }
    resp = client.post("/log_meals", json=meal)
    assert resp.status_code == 200
    meal_data = resp.json()
    assert meal_data["calories"] > 0

    resp2 = client.get("/meals/bob")
    assert resp2.status_code == 200
    assert len(resp2.json()) == 1


def test_webhook_logging():
    user = {
        "username": "carol",
        "age": 28,
        "gender": "female",
        "weight_kg": 55,
        "height_cm": 160,
    }
    client.post("/register", json=user)

    payload = {"message": "carol|lunch|apple:1"}
    resp = client.post("/webhook", json=payload)
    assert resp.status_code == 200
    assert resp.json()["calories"] > 0
