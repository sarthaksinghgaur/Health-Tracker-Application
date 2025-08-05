import { registerUser, logMeal, fetchStatus, fetchMeals } from './api.js';
import { displayStatus, renderMealHistory, showToast, initTheme, toggleTheme } from './ui.js';

const state = {
  currentUser: localStorage.getItem('username'),
  isLoading: false,
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  initTheme();
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(registerForm).entries());
      data.age = Number(data.age);
      data.weight_kg = Number(data.weight_kg);
      data.height_cm = Number(data.height_cm);
      try {
        await registerUser(data);
        localStorage.setItem('username', data.username);
        showToast('Registered successfully');
        window.location.href = 'index.html';
      } catch (err) {
        showToast('Registration failed');
      }
    });
    return;
  }

  if (!state.currentUser) {
    window.location.href = 'register.html';
    return;
  }

  loadStatus();
  loadMeals();

  const mealForm = document.getElementById('mealForm');
  mealForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(mealForm);
    const payload = {
      username: state.currentUser,
      meal_type: formData.get('meal_type'),
      items: [{ name: formData.get('item_name'), quantity: parseFloat(formData.get('quantity') || '1') }],
    };
    try {
      await logMeal(payload);
      mealForm.reset();
      await loadStatus();
      await loadMeals();
      showToast('Meal logged');
    } catch (err) {
      showToast('Error logging meal');
    }
  });
}

async function loadStatus() {
  try {
    const status = await fetchStatus(state.currentUser);
    displayStatus(status);
  } catch (err) {
    console.error(err);
  }
}

async function loadMeals() {
  try {
    const meals = await fetchMeals(state.currentUser);
    renderMealHistory(meals);
  } catch (err) {
    console.error(err);
  }
}
