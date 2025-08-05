export function displayStatus(status) {
  const statusDiv = document.getElementById('status');
  if (!statusDiv) return;
  const percent = status.bmr ? (status.calories_consumed / status.bmr) * 100 : 0;
  statusDiv.innerHTML = `
    <p>BMR: ${status.bmr.toFixed(0)}</p>
    <p>Consumed: ${status.calories_consumed.toFixed(0)} kcal</p>
    <div class="chart"><div class="bar" style="width:${Math.min(100, percent)}%"></div></div>
    <p>Remaining: ${status.calories_remaining.toFixed(0)} kcal</p>
  `;
}

export function renderMealHistory(meals) {
  const list = document.getElementById('history');
  if (!list) return;
  list.innerHTML = '';
  meals.forEach(m => {
    const li = document.createElement('li');
    const items = m.items.map(i => `${i.name} x${i.quantity}`).join(', ');
    li.textContent = `${m.meal_type}: ${items} - ${m.calories.toFixed(0)} kcal`;
    list.appendChild(li);
  });
}

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

export function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', theme === 'dark');
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
