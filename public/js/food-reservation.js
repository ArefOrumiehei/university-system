const API_BASE = 'http://localhost:3000/api';

// elems
const foodsDiv = document.getElementById('foods');
const reservationListDiv = document.querySelector('.reservation-list')
const balanceSpan = document.getElementById('balance');
let balance = 0;

// local storage
const userId = localStorage.getItem('userId');

// variables
let foods = [
  { name: 'چلوکباب', price: 80000, img: '../../assets/images/foods/kebab.jpeg' },
  { name: 'زرشک‌پلو', price: 70000, img: '../../assets/images/foods/zereshk-polo-morgh.jpg' },
  { name: 'ماکارونی', price: 60000, img: '../../assets/images/foods/makaroni.jpg' },
];

let selectedFoodIndex = null;


async function fetchBalance() {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/balance`);
    const data = await res.json();
    if (res.ok) {
      balance = data.balance;
      balanceSpan.innerText = balance.toLocaleString();
    }
  } catch (err) {
    showToast('خطا در دریافت موجودی', 'error');
  }
}


async function increaseBalance(amount) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/increase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, userId: userId })
    });

    const data = await res.json();

    if (res.ok) {
      await fetchBalance();
      showToast('موجودی با موفقیت افزایش یافت', 'success');
    } else {
      showToast(data.error || 'خطا در افزایش موجودی', 'error');
    }
  } catch (err) {
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
      <button onclick="selectFood(${index})">انتخاب</button>
    `;
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

  if (selectedFoodIndex === null || selectedFoodIndex === undefined) {
    showToast('لطفا ابتدا یک غذا انتخاب کنید', 'error');
    return;
  }
  if (!date) {
    showToast('لطفا تاریخ را انتخاب کنید', 'error');
    return;
  }
  if (!userId) {
    showToast('کاربر وارد نشده است', 'error');
    return;
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return showToast("رزرو برای تاریخ گذشته مجاز نیست", "error");
  }

  const selectedFood = foods[selectedFoodIndex];
  const foodName = selectedFood.name;
  const foodPrice = selectedFood.price;

  if (balance < foodPrice) {
    showToast('موجودی شما برای رزرو این غذا کافی نیست', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  } catch (err) {
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


    if (reservations.length === 0) {
  reservationListDiv.style.display = 'none';
} else {
  reservationListDiv.style.display = 'block';

  reservations.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.foodName}</td>
      <td>${r.restaurant}</td>
      <td><button class="delete-btn" onclick="deleteReservation('${r.userId}', '${r.date}')" style="background: tomato">حذف</button></td>
    `;
    tbody.appendChild(tr);
  });
}
    
  } catch (err) {
    showToast(err.message, 'error');
  }
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
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'error');
  }
}



document.addEventListener("DOMContentLoaded", () => {
  fetchBalance();
  renderFoods();
  loadReservations();
});

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    margin-top: 10px;
    font-family: "Vazirmatn", sans-serif;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
  `;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function toggleAmountOptions() {
  const menu = document.getElementById('amountOptions');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

window.addEventListener("click", function (e) {
  const menu = document.getElementById("amountOptions");
  const button = document.getElementById("toggleButton");

  if (!e.target.closest("#amountOptions") && !e.target.closest("#toggleButton")) {
    menu.style.display = "none";
  }
});
