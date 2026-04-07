# Laundry Shop Management System

## Project Description

The Laundry Shop Management System is a modern web-based application designed to help small laundry businesses manage customer transactions efficiently.

**Tech Stack:**

- **Frontend:** React.js (Vite)
- **Backend:** Node.js with Express.js
- **Database:** MySQL

## Getting Started

### Prerequisites
- Node.js (LTS Version)
- MySQL Server
- Git

### Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/JustineSalinas/Laundry-Shop-Management-System.git
   cd Laundry-Shop-Management-System
   ```

2. **Install frontend dependencies:**
   ```powershell
   cd client
   npm install
   ```

3. **Install backend dependencies:**
   ```powershell
   cd ../server
   npm install
   ```

4. **Database Setup:**
   - Create a database named `laundry_db`.
   - Match the MySQL credentials in `server/config/` (once configured).

## Team Members & Roles (Minions nila si Zallen - BSIT 2-C)

- **Adrian Justin Salinas** – Project Manager
- **Jedrik Jean Sayo** – Lead Developer
- **Leighmarie Abigial Vicente** – Frontend Developer
- **Alexandar Michael Tolosa** – Backend Developer
- **Zallen Fritz Eslabra** – Documentation and Quality Assurance

## Project Structure

```text
laundry-system/
│
├── client/                 # Frontend environment (React)
│   ├── public/             # Static assets (images, icons)
│   ├── src/                # UI Components, Pages, and CSS
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend environment (Node/Express)
│   ├── config/             # Database connection setup
│   ├── controllers/        # Logic for handling database requests
│   ├── routes/             # API endpoints (e.g., /api/transactions)
│   ├── index.js            # Main server entry point
│   └── package.json        # Backend dependencies
│
└── README.md               # Project documentation
```
