import { showToast } from '../../utils/toast.js';
import { CONFIG } from '../config.js';

const API_BASE = CONFIG.API_URL;

async function signup() {
  const user = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (!user || !email || !pass) {
    showToast('همه فیلدها الزامی هستند.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, email, password: pass }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || 'خطا در ثبت‌نام.', 'error');
      return;
    }

    if (data.error) {
      showToast(data.error, 'error');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);

    showToast('ثبت‌نام با موفقیت انجام شد', 'success');

    setTimeout(() => {
      window.location.href = '/public/pages/dashboard.html';
    }, 1500);

  } catch (error) {
    showToast(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signupBtn').addEventListener('click', signup);
});
