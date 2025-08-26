import { CONFIG } from '../../config.js';
import { showToast } from '../../utils/toast.js';

const API_BASE = CONFIG.API_URL;
const userId = localStorage.getItem("userId");
let username;

const sidebar = document.querySelector('.sidebar');
const dashboard = document.getElementById('dashboard-content');
const settings = document.getElementById('settings-content');
const dynamic = document.getElementById('dynamic-content');

const routes = {
  courses: "./dashboard/my-courses.html",
  grades: "./dashboard/grades.html",
  messages: "./dashboard/messages.html",
};

function loadContent(key) {
  sidebar.classList.remove('open');

  dashboard.style.display = key === "settings" ? 'none' : 'block';
  settings.style.display = key === "settings" ? 'block' : 'none';
  dynamic.style.display = key === "settings" ? 'none' : 'block';

  const url = routes[key];
  if (url) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const target = key === "settings" ? settings : dynamic;
        target.innerHTML = html;
      })
      .catch(() => {
        const target = key === "settings" ? settings : dynamic;
        target.innerHTML = "<p>خطا در بارگذاری محتوا</p>";
        showToast("خطا در بارگذاری محتوا", "error");
      });
  }
}

function getUserInfo() {
  fetch(`${API_BASE}/users/${userId}`)
    .then(res => {
      if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
      return res.json();
    })
    .then(user => {
      username = user.username;
      const usernameEl = document.getElementById('username');
      if (usernameEl) usernameEl.textContent = username;

      document.getElementById("new-username").value = username;

      const birthDateEl = document.getElementById('birth-date');
      if (user.birthDate) {
        birthDateEl.value = new Date(user.birthDate).toISOString().split('T')[0];
      } else {
        birthDateEl.value = "";
      }

      const defaultPlaceholder = "../../assets/images/placeholders/profile-placeholder.jpg";
      const avatarImg = document.getElementById("avatarImg");
      const profileImg = document.getElementById("profile-image");

      const imgSrc = user.profileImage || defaultPlaceholder;
      if (avatarImg) avatarImg.src = imgSrc;
      if (profileImg) profileImg.src = imgSrc;
    })
    .catch(err => {
      showToast("خطا در دریافت اطلاعات کاربر", "error");
    });
}

function saveChanges() {
  if (!userId) return showToast("شناسه کاربر یافت نشد", "error");

  const usernameInput = document.getElementById("new-username").value.trim();
  const birthDate = document.getElementById("birth-date").value;
  const profileImage = document.getElementById("profile-image").src;
  const defaultImage = window.location.origin + "/";

  const data = {};
  if (usernameInput) data.username = usernameInput;
  if (birthDate) data.birthDate = birthDate;
  if (profileImage && !profileImage.startsWith(defaultImage)) data.profileImage = profileImage;

  if (Object.keys(data).length === 0) {
    return showToast("هیچ فیلدی برای بروزرسانی وارد نشده است", "error");
  }

  fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error("خطا در بروزرسانی");
      return res.json();
    })
    .then(() => {
      showToast("اطلاعات با موفقیت به‌روزرسانی شد", "success");
      getUserInfo();
    })
    .catch(() => showToast("خطا در بروزرسانی اطلاعات", "error"));
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('profile-image').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleSidebar() {
  sidebar.classList.toggle('open');
}

function clearContents() {
  dynamic.innerHTML = "";
}

function logout() {
  localStorage.clear();
  window.location.href = '/frontend/src/pages/login.html';
}

// Events
document.querySelectorAll('.menu-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const key = link.getAttribute('data-key');
    loadContent(key);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  loadContent("dashboard");
  getUserInfo();
});

window.addEventListener("click", e => {
  if (!e.target.closest(".avatar-wrapper")) {
    document.getElementById("dropdownMenu").style.display = "none";
  }
  if (!e.target.closest('.sidebar') && !e.target.closest('#hamburgerBtn')) {
    sidebar.classList.remove('open');
  }
});

window.saveChanges = saveChanges;
window.toggleDropdown = toggleDropdown;
window.previewImage = previewImage;
window.logout = logout;
window.toggleSidebar = toggleSidebar;
window.clearContents = clearContents;
