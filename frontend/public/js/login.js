import { CONFIG } from '../../config.js';
import { showToast } from '../../utils/toast.js';

const API_BASE = CONFIG.API_URL;

async function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (!user || !pass) {
    showToast('لطفا نام کاربری و رمز خود را وارد کنید.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      showToast(data.error || 'خطا در ورود به سیستم', 'error');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);

    showToast('ورود با موفقیت انجام شد', 'success');
    setTimeout(() => {
      window.location.href = '/frontend/public/pages/dashboard.html';
    }, 1500);

  } catch (error) {
    showToast('خطا در ارتباط با سرور', 'error');
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginBtn').addEventListener('click', login);
});