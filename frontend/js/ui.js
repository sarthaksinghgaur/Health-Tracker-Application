export function displayStatus(status) {
  console.log('displayStatus called with:', status);
  const statusDiv = document.getElementById('status');
  console.log('Status div found:', statusDiv);
  if (!statusDiv) return;
  
  // If no status data, show default/empty state
  if (!status || !status.bmr) {
    statusDiv.innerHTML = `
      <div class="status-card">
        <h3><i class="fas fa-fire"></i> Daily Calories</h3>
        <div class="value">0</div>
        <div class="unit">kcal consumed</div>
        <div class="progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
            <span>0% of daily goal</span>
            <span>0 kcal goal</span>
          </div>
        </div>
      </div>
      
      <div class="status-card">
        <h3><i class="fas fa-arrow-down"></i> Remaining</h3>
        <div class="value">0</div>
        <div class="unit">kcal left today</div>
        <div class="progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%; background: var(--gradient-warning);"></div>
          </div>
        </div>
      </div>
      
      <div class="status-card">
        <h3><i class="fas fa-calculator"></i> BMR</h3>
        <div class="value">0</div>
        <div class="unit">kcal daily need</div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
          <i class="fas fa-info-circle"></i> Complete your profile to calculate BMR
        </div>
      </div>
      
      <div class="status-card">
        <h3><i class="fas fa-chart-line"></i> Progress</h3>
        <div class="value">0%</div>
        <div class="unit">daily goal achieved</div>
        <div class="progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%; background: var(--gradient-success);"></div>
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--accent-success); font-weight: 500;">
            Start logging meals to see your progress! 💪
          </div>
        </div>
      </div>
    `;
    return;
  }
  
  const percent = status.bmr ? (status.calories_consumed / status.bmr) * 100 : 0;
  const remainingPercent = Math.max(0, 100 - percent);
  
  statusDiv.innerHTML = `
    <div class="status-card">
      <h3><i class="fas fa-fire"></i> Daily Calories</h3>
      <div class="value">${status.calories_consumed.toFixed(0)}</div>
      <div class="unit">kcal consumed</div>
      <div class="progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min(100, percent)}%"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
          <span>${percent.toFixed(1)}% of daily goal</span>
          <span>${status.bmr.toFixed(0)} kcal goal</span>
        </div>
      </div>
    </div>
    
    <div class="status-card">
      <h3><i class="fas fa-arrow-down"></i> Remaining</h3>
      <div class="value">${status.calories_remaining.toFixed(0)}</div>
      <div class="unit">kcal left today</div>
      <div class="progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${remainingPercent}%; background: var(--gradient-warning);"></div>
        </div>
      </div>
    </div>
    
    <div class="status-card">
      <h3><i class="fas fa-calculator"></i> BMR</h3>
      <div class="value">${status.bmr.toFixed(0)}</div>
      <div class="unit">kcal daily need</div>
      <div style="margin-top: 1rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
        <i class="fas fa-info-circle"></i> Basal Metabolic Rate
      </div>
    </div>
    
    <div class="status-card">
      <h3><i class="fas fa-chart-line"></i> Progress</h3>
      <div class="value">${percent.toFixed(1)}%</div>
      <div class="unit">daily goal achieved</div>
      <div class="progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min(100, percent)}%; background: ${percent >= 100 ? 'var(--gradient-warning)' : 'var(--gradient-success)'};"></div>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.875rem; color: ${percent >= 100 ? 'var(--accent-warning)' : 'var(--accent-success)'}; font-weight: 500;">
          ${percent >= 100 ? 'Goal achieved! 🎉' : 'Keep going! 💪'}
        </div>
      </div>
    </div>
  `;
}

export function renderMealHistory(meals) {
  const historyDiv = document.getElementById('history');
  if (!historyDiv) return;
  
  if (meals.length === 0) {
    historyDiv.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
        <i class="fas fa-utensils" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <h3>No meals logged yet</h3>
        <p>Start by logging your first meal above!</p>
      </div>
    `;
    return;
  }
  
  historyDiv.innerHTML = meals.map(meal => {
    const items = meal.items.map(item => `${item.name} x${item.quantity}`).join(', ');
    const mealTypeIcon = getMealTypeIcon(meal.meal_type);
    const mealTypeColor = getMealTypeColor(meal.meal_type);
    
    // Handle timestamp - use current time if not provided
    const timestamp = meal.timestamp || new Date().toISOString();
    const mealDate = new Date(timestamp);
    
    // Check if date is valid
    const time = isNaN(mealDate.getTime()) ? 'Just now' : mealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = isNaN(mealDate.getTime()) ? 'Today' : mealDate.toLocaleDateString();
    
    return `
      <div class="meal-item">
        <div class="meal-info">
          <div class="meal-name">${items}</div>
          <div class="meal-details">
            <span class="meal-type" style="background: ${mealTypeColor}">
              <i class="${mealTypeIcon}"></i>
              ${meal.meal_type}
            </span>
            <span><i class="fas fa-fire"></i> ${meal.calories.toFixed(0)} kcal</span>
            <span><i class="fas fa-clock"></i> ${time}</span>
            <span><i class="fas fa-calendar"></i> ${date}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn-secondary" style="padding: 0.5rem; font-size: 0.875rem;" onclick="editMeal('${meal.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-secondary" style="padding: 0.5rem; font-size: 0.875rem; color: var(--accent-danger);" onclick="deleteMeal('${meal.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function getMealTypeIcon(mealType) {
  const icons = {
    breakfast: 'fas fa-sun',
    lunch: 'fas fa-cloud-sun',
    dinner: 'fas fa-moon',
    snack: 'fas fa-cookie-bite'
  };
  return icons[mealType] || 'fas fa-utensils';
}

function getMealTypeColor(mealType) {
  const colors = {
    breakfast: 'var(--gradient-warning)',
    lunch: 'var(--gradient-primary)',
    dinner: 'var(--gradient-secondary)',
    snack: 'var(--gradient-success)'
  };
  return colors[mealType] || 'var(--accent-primary)';
}

export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <i class="${icon}" style="color: ${type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'};"></i>
      <span>${message}</span>
    </div>
  `;
  
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

export function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', theme === 'dark');
  
  // Update theme toggle button text
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const icon = themeBtn.querySelector('i');
    const text = themeBtn.querySelector('span');
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      text.textContent = 'Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      text.textContent = 'Dark Mode';
    }
  }
  
  // Set current user in header
  const currentUserSpan = document.getElementById('currentUser');
  const userDisplayNameSpan = document.getElementById('userDisplayName');
  if (currentUserSpan || userDisplayNameSpan) {
    const username = localStorage.getItem('username');
    if (username) {
      if (currentUserSpan) currentUserSpan.textContent = username;
      if (userDisplayNameSpan) userDisplayNameSpan.textContent = username;
    }
  }
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Update theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const icon = themeBtn.querySelector('i');
    const text = themeBtn.querySelector('span');
    if (isDark) {
      icon.className = 'fas fa-sun';
      text.textContent = 'Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      text.textContent = 'Dark Mode';
    }
  }
}

// Add these functions for meal editing and deletion (placeholder for now)
window.editMeal = function(mealId) {
  showToast('Edit functionality coming soon!', 'error');
};

window.deleteMeal = function(mealId) {
  if (confirm('Are you sure you want to delete this meal?')) {
    showToast('Delete functionality coming soon!', 'error');
  }
};
