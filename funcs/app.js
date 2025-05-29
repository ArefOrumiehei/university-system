let username;

    const routes = {
      courses: "./dashboard/my-courses.html",
      grades: "./dashboard/grades.html",
      messages: "./dashboard/messages.html",
      settings: "./dashboard/settings.html"
    };

    function loadContent(key) {
      const url = routes[key];

      if (key === "settings") {
        document.getElementById('dashboard-content').style.display = 'none'
      } else {
        document.getElementById('dashboard-content').style.display = 'block'
      }

      if (url) {
        fetch(url)
          .then(res => res.text())
          .then(html => {
            document.getElementById('dynamic-content').innerHTML = html;
          })
          .catch(err => {
            document.getElementById('dynamic-content').innerHTML = "<p>خطا در بارگذاری محتوا</p>";
            console.error(err);
          });
      }
    }

    document.querySelectorAll('.menu-item').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const key = link.getAttribute('data-key');
        loadContent(key);
      });
    });

    window.addEventListener("DOMContentLoaded", () => {
      loadContent("dashboard");
    });

    function clearContents() {
      document.getElementById('dynamic-content').innerHTML = ""
    }


    const API_BASE = 'http://localhost:3000/api';
    const userId = localStorage.getItem("userId");

    function getUserInfo() {
      fetch(`${API_BASE}/users/${userId}`)
        .then(response => {
          if (!response.ok) {
            console.log(response);
          };
          return response.json();
        })
        .then(user => {
          console.log('اطلاعات کاربر:', user);
          let username = user.username;
          const usernameEl = document.getElementById('username');
          if (usernameEl) usernameEl.textContent = username;

          const birthDateEl = document.getElementById('birth-date');
          if (birthDateEl) birthDateEl.value = user.birthDate;

          if (user.profileImage) {
            const avatarImg = document.getElementById("avatarImg");
            const profileImg = document.getElementById("profile-image");
            if (avatarImg) avatarImg.src = user.profileImage;
            if (profileImg) profileImg.src = user.profileImage;
          }
        })
        .catch(error => {
          console.error('مشکل در دریافت اطلاعات کاربر', error);
        });
    }
    

    

    function logout() {
      localStorage.clear();
      window.location.href = '/public/pages/login.html';
    }

    window.addEventListener('DOMContentLoaded', () => {
      getUserInfo();
      if (username) {
        document.getElementById('username').textContent = username;
      }
    });

    function toggleDropdown() {
      const menu = document.getElementById("dropdownMenu");
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }

    window.addEventListener("click", function (e) {
      const menu = document.getElementById("dropdownMenu");
      if (!e.target.closest(".avatar-wrapper")) {
        menu.style.display = "none";
      }
    });


    function previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('profile-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }


    function saveChanges() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("شناسه کاربر یافت نشد.");
        return;
      }

      const usernameInput = document.getElementById("new-username");
      const birthDateInput = document.getElementById("birth-date");
      const profileImage = document.getElementById("profile-image").src;

      const username = usernameInput.value.trim();
      const birthDate = birthDateInput.value;
      const defaultImage = window.location.origin + "/"; // یا آدرس پیش‌فرض اولیه img

      // ساختن داده‌ها فقط با فیلدهایی که پر شده‌اند
      const data = {};
      if (username) data.username = username;
      if (birthDate) data.birthDate = birthDate;
      if (profileImage && !profileImage.startsWith(defaultImage)) data.profileImage = profileImage;

      if (Object.keys(data).length === 0) {
        console.warn("هیچ فیلدی برای بروزرسانی وارد نشده است.");
        return;
      }
      fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) throw new Error("خطا در بروزرسانی");
          return res.json();
        })
        .then(() => {
          console.log("اطلاعات با موفقیت به‌روزرسانی شد.");
          usernameInput.value = "";
          birthDateInput.value = "";
          getUserInfo();
        })
        .catch(err => console.error("خطا:", err.message));
    }