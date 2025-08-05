import { registerUser, logMeal, fetchStatus, fetchMeals } from './api.js';
import { displayStatus, renderMealHistory, showToast, initTheme, toggleTheme } from './ui.js';

const state = {
  currentUser: localStorage.getItem('username'),
  isLoading: false,
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  initTheme();
  
  // Theme toggle functionality
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Registration page
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
    return;
  }

  // Dashboard page
  if (!state.currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Initialize dashboard
  initializeDashboard();
}

async function handleRegistration(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  try {
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.age = Number(data.age);
    data.weight_kg = Number(data.weight_kg);
    data.height_cm = Number(data.height_cm);
    
    await registerUser(data);
    localStorage.setItem('username', data.username);
    showToast('Account created successfully! Welcome to HealthTracker! 🎉', 'success');
    
    // Small delay for better UX
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (err) {
    console.error('Registration error:', err);
    showToast('Registration failed. Please try again.', 'error');
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function initializeDashboard() {
  // Ensure dashboard section is active
  const dashboardSection = document.getElementById('dashboard');
  if (dashboardSection) {
    dashboardSection.classList.add('active');
  }
  
  // Load initial data
  loadStatus();
  loadMeals();

  // Meal form submission
  const mealForm = document.getElementById('mealForm');
  if (mealForm) {
    mealForm.addEventListener('submit', handleMealSubmission);
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Navigation functionality
  setupNavigation();
  
  // Profile form functionality
  setupProfileForm();
  
  // Add form validation and real-time feedback
  setupFormValidation();
  
  // Load profile data
  loadProfileData();
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear user data
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    
    showToast('Logged out successfully', 'success');
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }
}

async function handleMealSubmission(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  try {
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const payload = {
      username: state.currentUser,
      meal_type: formData.get('meal_type'),
      items: [{ 
        name: formData.get('item_name'), 
        quantity: parseFloat(formData.get('quantity') || '1') 
      }],
    };
    
    await logMeal(payload);
    e.target.reset();
    
    // Reload data
    await Promise.all([loadStatus(), loadMeals()]);
    
    showToast('Meal logged successfully! 🍽️', 'success');
    
  } catch (err) {
    console.error('Meal logging error:', err);
    showToast('Failed to log meal. Please try again.', 'error');
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function setupFormValidation() {
  const mealForm = document.getElementById('mealForm');
  if (!mealForm) return;
  
  const inputs = mealForm.querySelectorAll('input, select');
  const submitBtn = mealForm.querySelector('button[type="submit"]');
  
  inputs.forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('change', validateForm);
  });
  
  function validateForm() {
    const formData = new FormData(mealForm);
    const mealType = formData.get('meal_type');
    const itemName = formData.get('item_name');
    const quantity = formData.get('quantity');
    
    const isValid = mealType && itemName.trim() && quantity > 0;
    
    if (submitBtn) {
      submitBtn.disabled = !isValid;
      submitBtn.style.opacity = isValid ? '1' : '0.6';
    }
  }
  
  // Initial validation
  validateForm();
}

async function loadStatus() {
  try {
    console.log('Loading status for user:', state.currentUser);
    
    if (!state.currentUser) {
      console.log('No current user found');
      displayStatus(null);
      return;
    }
    
    const status = await fetchStatus(state.currentUser);
    console.log('Status data received:', status);
    displayStatus(status);
  } catch (err) {
    console.error('Error loading status:', err);
    showToast('Failed to load status data.', 'error');
    // Show empty state on error
    displayStatus(null);
  }
}

async function loadMeals() {
  try {
    const meals = await fetchMeals(state.currentUser);
    renderMealHistory(meals);
  } catch (err) {
    console.error('Error loading meals:', err);
    showToast('Failed to load meal history.', 'error');
  }
}

// Navigation functionality
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all nav items
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Hide all content sections
      const sections = document.querySelectorAll('.content-section');
      sections.forEach(section => section.classList.remove('active'));
      
      // Show the target section
      const targetSection = item.getAttribute('data-section');
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.classList.add('active');
        
        // Load section-specific data
        loadSectionData(targetSection);
      }
    });
  });
}

// Load section-specific data
function loadSectionData(section) {
  switch (section) {
    case 'meals':
      loadMealsByCategory();
      break;
    case 'analytics':
      loadAnalyticsData();
      break;
    case 'profile':
      loadProfileData();
      break;
  }
}

// Load meals by category
function loadMealsByCategory() {
  fetchMeals(state.currentUser).then(meals => {
    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    categories.forEach(category => {
      const categoryMeals = meals.filter(meal => meal.meal_type === category);
      const countElement = document.getElementById(`${category}-count`);
      const caloriesElement = document.getElementById(`${category}-calories`);
      const listElement = document.getElementById(`${category}-list`);
      
      if (countElement) countElement.textContent = categoryMeals.length;
      
      const totalCalories = categoryMeals.reduce((sum, meal) => sum + meal.calories, 0);
      if (caloriesElement) caloriesElement.textContent = Math.round(totalCalories);
      
      if (listElement) {
        if (categoryMeals.length === 0) {
          listElement.innerHTML = `<p class="empty-state">No ${category} meals logged yet</p>`;
        } else {
          listElement.innerHTML = categoryMeals.map(meal => {
            const timestamp = meal.timestamp || new Date().toISOString();
            const mealDate = new Date(timestamp);
            const time = isNaN(mealDate.getTime()) ? 'Just now' : mealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return `
              <div class="meal-item">
                <div class="meal-info">
                  <div class="meal-name">${meal.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</div>
                  <div class="meal-details">
                    <span><i class="fas fa-fire"></i> ${Math.round(meal.calories)} kcal</span>
                    <span><i class="fas fa-clock"></i> ${time}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    });
  }).catch(err => {
    console.error('Error loading meals by category:', err);
  });
}

// Load analytics data
function loadAnalyticsData() {
  // Update nutrition percentages
  fetchStatus(state.currentUser).then(status => {
    const total = status.protein + status.carbs + status.fat;
    if (total > 0) {
      document.getElementById('protein-percentage').textContent = Math.round((status.protein / total) * 100) + '%';
      document.getElementById('carbs-percentage').textContent = Math.round((status.carbs / total) * 100) + '%';
      document.getElementById('fat-percentage').textContent = Math.round((status.fat / total) * 100) + '%';
    }
    
    // Update goal progress
    const goalPercentage = Math.round((status.calories_consumed / status.bmr) * 100);
    document.getElementById('goal-percentage').textContent = goalPercentage + '%';
    document.getElementById('goal-current').textContent = Math.round(status.calories_consumed);
    document.getElementById('goal-target').textContent = Math.round(status.bmr);
    
    // Update goal circle
    const goalCircle = document.querySelector('.goal-circle');
    if (goalCircle) {
      const percentage = Math.min(goalPercentage, 100);
      goalCircle.style.background = `conic-gradient(var(--accent-primary) 0deg ${percentage * 3.6}deg, var(--bg-tertiary) ${percentage * 3.6}deg 360deg)`;
    }
  }).catch(err => {
    console.error('Error loading analytics data:', err);
  });
}

// Load profile data
function loadProfileData() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  // Update profile display
  document.getElementById('profile-name').textContent = userData.username || 'User Name';
  document.getElementById('profile-username').value = userData.username || '';
  document.getElementById('profile-age').value = userData.age || '';
  document.getElementById('profile-gender').value = userData.gender || 'male';
  document.getElementById('profile-weight').value = userData.weight_kg || '';
  document.getElementById('profile-height').value = userData.height_cm || '';
  
  // Calculate and display BMR
  if (userData.age && userData.weight_kg && userData.height_cm) {
    const bmr = calcBMR(userData);
    document.getElementById('profile-bmr').value = Math.round(bmr);
  }
  
  // Update profile stats
  fetchMeals(state.currentUser).then(meals => {
    document.getElementById('profile-meals').textContent = meals.length;
    document.getElementById('profile-days').textContent = Math.max(1, Math.ceil(meals.length / 3)); // Rough estimate
    document.getElementById('profile-goals').textContent = Math.floor(meals.length / 7); // Rough estimate
  }).catch(err => {
    console.error('Error loading profile stats:', err);
  });
}

// Setup profile form
function setupProfileForm() {
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Setup preference toggles
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = localStorage.getItem('theme') === 'dark';
    darkModeToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

// Handle profile update
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const updatedData = {
    username: formData.get('username'),
    age: Number(formData.get('age')),
    gender: formData.get('gender'),
    weight_kg: Number(formData.get('weight_kg')),
    height_cm: Number(formData.get('height_cm'))
  };
  
  // Update localStorage
  const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
  const newUserData = { ...currentUserData, ...updatedData };
  localStorage.setItem('userData', JSON.stringify(newUserData));
  
  showToast('Profile updated successfully!', 'success');
}

// Simple BMR calculation (you might want to use the backend service)
function calcBMR(userData) {
  if (userData.gender === 'male') {
    return 88.362 + (13.397 * userData.weight_kg) + (4.799 * userData.height_cm) - (5.677 * userData.age);
  } else {
    return 447.593 + (9.247 * userData.weight_kg) + (3.098 * userData.height_cm) - (4.330 * userData.age);
  }
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to status cards
  const statusCards = document.querySelectorAll('.status-card');
  statusCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit meal form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const mealForm = document.getElementById('mealForm');
      if (mealForm && document.activeElement.closest('#mealForm')) {
        mealForm.requestSubmit();
      }
    }
    
    // Ctrl/Cmd + D to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleTheme();
    }
  });
});

// Global functions for goal editing
window.editGoal = function(goalType) {
  showToast('Goal editing functionality coming soon!', 'error');
};
