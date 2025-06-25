function injectToastStyles() {
  if (document.getElementById('toast-styles')) return;

  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    #toast-container {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }

    .toast {
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-family: "Vazirmatn", sans-serif;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      animation: fadein 0.5s;
      width: fit-content;
      max-width: 300px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .toast-success {
      background-color: #28a745;
    }

    .toast-error {
      background-color: #dc3545;
    }

    .fade-out {
      animation: fadeout 0.5s forwards;
    }

    @keyframes fadein {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeout {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}

export function showToast(message, type = 'success', duration = 3000) {
  injectToastStyles();

  const toastContainer = createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}
