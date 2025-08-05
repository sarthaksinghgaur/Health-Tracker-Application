const BASE_URL = '/api';
// const BASE_URL = 'http://127.0.0.1:8000';

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Login failed');
  }
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Registration failed');
  }
  return res.json();
}

export async function logMeal(data) {
  const res = await fetch(`${BASE_URL}/log_meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Log meal failed');
  return res.json();
}

export async function fetchStatus(username) {
  const res = await fetch(`${BASE_URL}/status/${username}`);
  if (!res.ok) throw new Error('Status fetch failed');
  return res.json();
}

export async function fetchMeals(username) {
  const res = await fetch(`${BASE_URL}/meals/${username}`);
  if (!res.ok) throw new Error('Meals fetch failed');
  return res.json();
}
