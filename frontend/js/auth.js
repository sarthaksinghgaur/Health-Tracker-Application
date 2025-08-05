import { loginUser, registerUser } from './api.js';
import { showToast, initTheme, toggleTheme } from './ui.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  initTheme();
  
  // Theme toggle functionality
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Check if we're on login or register page
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
  }
  
  // Check if user is already logged in
  const currentUser = localStorage.getItem('username');
  if (currentUser && window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  try {
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      remember: formData.get('remember') === 'on'
    };
    
    const response = await loginUser(data);
    
    // Store user data
    localStorage.setItem('username', data.username);
    localStorage.setItem('userData', JSON.stringify(response.user));
    
    if (data.remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
    
    showToast('Welcome back! 🎉', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (err) {
    console.error('Login error:', err);
    showToast(err.message || 'Login failed. Please check your credentials.', 'error');
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

async function handleRegistration(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  try {
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      age: Number(formData.get('age')),
      gender: formData.get('gender'),
      weight_kg: Number(formData.get('weight_kg')),
      height_cm: Number(formData.get('height_cm'))
    };
    
    const response = await registerUser(data);
    
    // Store user data
    localStorage.setItem('username', data.username);
    localStorage.setItem('userData', JSON.stringify(response.user));
    
    showToast('Account created successfully! Welcome to HealthTracker! 🎉', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (err) {
    console.error('Registration error:', err);
    showToast(err.message || 'Registration failed. Please try again.', 'error');
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Password toggle functionality
window.togglePassword = function() {
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.querySelector('.password-toggle i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.className = 'fas fa-eye-slash';
  } else {
    passwordInput.type = 'password';
    toggleBtn.className = 'fas fa-eye';
  }
};

window.toggleConfirmPassword = function() {
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const toggleBtn = document.querySelector('.password-toggle:last-of-type i');
  
  if (confirmPasswordInput.type === 'password') {
    confirmPasswordInput.type = 'text';
    toggleBtn.className = 'fas fa-eye-slash';
  } else {
    confirmPasswordInput.type = 'password';
    toggleBtn.className = 'fas fa-eye';
  }
};

// Form validation
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    setupFormValidation(loginForm);
  }
  
  if (registerForm) {
    setupFormValidation(registerForm);
  }
});

function setupFormValidation(form) {
  const inputs = form.querySelectorAll('input[required]');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  inputs.forEach(input => {
    input.addEventListener('input', () => validateForm(form, submitBtn));
    input.addEventListener('blur', () => validateForm(form, submitBtn));
  });
  
  // Initial validation
  validateForm(form, submitBtn);
}

function validateForm(form, submitBtn) {
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
    }
    
    // Special validation for password
    if (input.type === 'password' && input.value.length < 6) {
      isValid = false;
    }
    
    // Special validation for email-like fields
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
      }
    }
  });
  
  // Check password confirmation
  const password = form.querySelector('#password');
  const confirmPassword = form.querySelector('#confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    isValid = false;
    if (confirmPassword.value) {
      showToast('Passwords do not match', 'error');
    }
  }
  
  if (submitBtn) {
    submitBtn.disabled = !isValid;
    submitBtn.style.opacity = isValid ? '1' : '0.6';
  }
}

// Auto-login if remember me is enabled
document.addEventListener('DOMContentLoaded', () => {
  const rememberMe = localStorage.getItem('rememberMe');
  const username = localStorage.getItem('username');
  
  if (rememberMe === 'true' && username && window.location.pathname.includes('login.html')) {
    // Auto-fill username
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.value = username;
    }
  }
}); 