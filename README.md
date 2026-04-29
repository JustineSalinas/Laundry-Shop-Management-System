# 🧺 Laundry Ease | Laundry Shop Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

The **Laundry Ease** Management System is a modern web-based application designed to help small laundry businesses manage customer transactions, track laundry status, and operate efficiently.

---

## ✨ Features
- **User Authentication:** Secure login and registration using JWT and bcrypt.
- **Transaction Management:** Add, update, and track laundry orders.
- **Modern UI:** Built with React and Vite for a fast, responsive user experience.
- **RESTful API:** Robust Node.js & Express backend.
- **Relational Database:** Data persistence and management using MySQL.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (via `mysql2`)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Middleware:** CORS, dotenv

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/JustineSalinas/Laundry-Shop-Management-System.git
   cd Laundry-Shop-Management-System
   ```

2. **Frontend Setup:**
   ```powershell
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   Open a new terminal and navigate to the server directory:
   ```powershell
   cd server
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `server` directory and add your database credentials and JWT secret (example):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=laundry_db
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Database Setup:**
   - Ensure your MySQL server is running.
   - Create a database named `laundry_db`.
   - Update your backend configuration (`server/config/` or `.env`) to match your local setup.

6. **Start the Backend Server:**
   ```powershell
   npm start
   ```

---

## 📂 Project Structure

```text
Laundry-Shop-Management-System/
│
├── client/                 # Frontend environment (React + Vite)
│   ├── public/             # Static assets
│   ├── src/                # UI Components, Pages, and Assets
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend environment (Node.js + Express)
│   ├── config/             # Database connection setup
│   ├── controllers/        # Logic for handling API requests
│   ├── routes/             # API endpoints definitions
│   ├── index.js            # Main server entry point
│   └── package.json        # Backend dependencies
│
└── README.md               # Project documentation
```

---

## 👥 Team Members & Roles 
*(Minions nila si Zallen - BSIT 2-C)*

- **Adrian Justin Salinas** – Project Manager
- **Jedrik Jean Sayo** – Lead Developer
- **Leighmarie Abigail Vicente** – Frontend Developer
- **Alexandar Michael Tolosa** – Backend Developer
- **Zallen Fritz Eslabra** – Documentation and Quality Assurance
