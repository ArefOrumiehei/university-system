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