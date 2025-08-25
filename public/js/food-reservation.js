import { showToast } from "../../utils/toast.js";
import { CONFIG } from "../config.js";

const API_BASE = CONFIG.API_URL;
const foods = [
  { name: 'چلوکباب', price: 80000, img: '../../assets/images/foods/kebab.jpeg' },
  { name: 'زرشک‌پلو', price: 70000, img: '../../assets/images/foods/zereshk-polo-morgh.jpg' },
  { name: 'ماکارونی', price: 60000, img: '../../assets/images/foods/makaroni.jpg' },
];

let balance = 0;
let selectedFoodIndex = null;
const userId = localStorage.getItem('userId');

// DOM Elements
const foodsDiv = document.getElementById('foods');
const balanceSpan = document.getElementById('balance');
const reservationListDiv = document.querySelector('.reservation-list');

// Initial Setup
window.addEventListener("DOMContentLoaded", () => {
  fetchBalance();
  renderFoods();
  loadReservations();

  document.getElementById('reserveBtn')?.addEventListener('click', addReservation);
  document.getElementById('toggleButton')?.addEventListener('click', toggleAmountOptions);

  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount);
      if (!isNaN(amount)) increaseBalance(amount);
    });
  });

  window.addEventListener('click', (e) => {
    const menu = document.getElementById("amountOptions");
    if (!e.target.closest("#amountOptions") && !e.target.closest("#toggleButton")) {
      menu.style.display = "none";
    }
  });
});

async function fetchBalance() {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/balance`);
    const data = await res.json();
    if (res.ok) {
      balance = data.balance;
      balanceSpan.innerText = balance.toLocaleString();
    }
  } catch {
    showToast('خطا در دریافت موجودی', 'error');
  }
}

async function increaseBalance(amount) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/increase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, userId })
    });
    const data = await res.json();
    if (res.ok) {
      await fetchBalance();
      showToast('موجودی با موفقیت افزایش یافت', 'success');
    } else {
      showToast(data.error || 'خطا در افزایش موجودی', 'error');
    }
  } catch {
    showToast('خطا در ارتباط با سرور', 'error');
  }
}

function renderFoods() {
  foodsDiv.innerHTML = '';
  foods.forEach((food, index) => {
    const div = document.createElement('div');
    div.className = 'food-card';
    div.innerHTML = `
      <img src="${food.img}" alt="${food.name}" />
      <div>${food.name}</div>
      <div>${food.price.toLocaleString()} تومان</div>
      <button class="select-food-btn">انتخاب</button>
    `;
    div.querySelector('.select-food-btn').addEventListener('click', () => selectFood(index));
    foodsDiv.appendChild(div);
  });
}

function selectFood(index) {
  selectedFoodIndex = index;
  const food = foods[index];
  document.getElementById('selectedMessage').innerText = `غذای انتخاب شده: ${food.name} - قیمت: ${food.price.toLocaleString()} تومان`;
}

async function addReservation() {
  const date = document.getElementById('date').value;
  const restaurant = document.getElementById('restaurant').value;

  if (selectedFoodIndex == null) return showToast('لطفا ابتدا یک غذا انتخاب کنید', 'error');
  if (!date) return showToast('لطفا تاریخ را انتخاب کنید', 'error');
  if (!userId) return showToast('کاربر وارد نشده است', 'error');

  const selectedDate = new Date(date);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return showToast("رزرو برای تاریخ گذشته مجاز نیست", "error");

  const { name: foodName, price: foodPrice } = foods[selectedFoodIndex];
  if (balance < foodPrice) return showToast('موجودی شما برای رزرو این غذا کافی نیست', 'error');

  try {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, date, foodName, restaurant, foodPrice }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchBalance();
      showToast('رزرو با موفقیت ثبت شد', 'success');
      selectedFoodIndex = null;
      document.getElementById('selectedMessage').innerText = '';
      document.getElementById('date').value = '';
      loadReservations();
    } else {
      showToast(data.error || 'خطا در ثبت رزرو', 'error');
    }
  } catch {
    showToast('خطا در ارتباط با سرور', 'error');
  }
}

async function loadReservations() {
  if (!userId) return;
  try {
    const res = await fetch(`${API_BASE}/reservations/${userId}`);
    if (!res.ok) throw new Error('خطا در دریافت رزروها');

    const reservations = await res.json();
    const tbody = document.getElementById('reservationTable');
    tbody.innerHTML = '';

    reservationListDiv.style.display = reservations.length ? 'block' : 'none';
    reservations.forEach(r => tbody.appendChild(createReservationRow(r)));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function createReservationRow(reservation) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${reservation.date}</td>
    <td>${reservation.foodName}</td>
    <td>${reservation.restaurant}</td>
    <td><button class="delete-btn" style="background: tomato">حذف</button></td>
  `;
  tr.querySelector('.delete-btn').addEventListener('click', () => deleteReservation(reservation.userId, reservation.date));
  return tr;
}

async function deleteReservation(userId, date) {
  if (!confirm(`آیا از حذف رزرو تاریخ ${date} مطمئن هستید؟`)) return;

  try {
    const res = await fetch(`${API_BASE}/reservations/${userId}/${date}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (res.ok) {
      showToast('رزرو حذف شد', 'success');
      loadReservations();
      fetchBalance();
    } else {
      showToast(data.error || 'خطا در حذف رزرو', 'error');
    }
  } catch {
    showToast('خطا در ارتباط با سرور', 'error');
  }
}

function toggleAmountOptions() {
  const menu = document.getElementById('amountOptions');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
