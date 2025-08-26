# 🎓 University Management System

A modern university management system with features such as:

* User management (Login, Signup, Profile editing)
* Food reservation and wallet top-up
* Course, grades, and message display
* Responsive and modern UI
* Backend API using Node.js and Express

---

## 🔧 Technologies Used

### Frontend:

* HTML5, CSS3 (with Persian `Vazirmatn` font)
* Vanilla JavaScript (ES6 Modules)
* Responsive design

### Backend:

* Node.js + Express.js
* MongoDB with Mongoose
* JWT-based authentication
* RESTful API

---

## 📁 Project Structure

```
/university-system
│
├── frontend/
    ├── assets/
    ├── src/
         ├── pages/
            ├── login.html
            ├── signup.html
            ├── dashboard.html
            └── food-reservation.html
         ├── styles/
            └── *.css
         └── js/
            └── *.js
    ├── utils/
      └── toast.js
    ├── config.js
    ├── index.html
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── .env
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Create a `.env` file in the backend directory:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/university-db
JWT_SECRET=yourSecretKey
```

### 3. Run the project

```bash
# Start the backend server
cd backend
node server

# Frontend: open in browser
http://localhost:3000/frontend/index.html
```

---

## ✨ Features

| Section          | Description                                     |
| ---------------- | ----------------------------------------------- |
| Auth             | JWT-based login and signup                      |
| User Profile     | Edit username, birthdate, and upload avatar     |
| Dashboard        | Welcome message and announcements               |
| Food Reservation | Pick date, food, and restaurant + top-up wallet |
| Courses/Grades   | View courses and grades (WIP)                   |

---

## 🔒 Security

* JWT authentication for protected routes
* Token verification on each request
* Input sanitization to prevent XSS/Injection attacks

---

## 🤝 Contributing

We’d love your help improving this project! Here’s how you can contribute:

### 🧭 How to Contribute

1. **Fork the repository**
   Click the `Fork` button at the top right of this page to create a copy in your GitHub account.

2. **Clone your fork locally**

   ```bash
   git clone https://github.com/ArefOrumiehei/university-system.git
   cd university-system
   ```

3. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   Implement and test your feature or bugfix.

5. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: add X feature"  # or "fix: fix Y bug"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   Go to your forked repository on GitHub and click **"Compare & pull request"**.

---

### ✅ Contribution Guidelines

* Ensure your code works and is clean before opening a PR.
* Use meaningful and descriptive commit messages.
* If you add new features, update the README accordingly.
* If you encounter any problems, feel free to open an issue.