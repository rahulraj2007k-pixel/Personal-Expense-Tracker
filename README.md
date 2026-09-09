 # Personal Expense Tracker

A full-stack web application for managing personal income and expenses.

## 🚀 Live Demo

https://personal-expense-tracker-15rx.onrender.com

## 📌 Features

- User Registration
- User Login & Authentication
- Secure Password Hashing
- JWT Authentication
- Add Income and Expenses
- Categorize Transactions
- View All Transactions
- Edit Transactions
- Delete Transactions
- Dashboard Summary
- Total Income Calculation
- Total Expense Calculation
- Balance Calculation
- Expense Chart
- Transaction Filtering
- Responsive Design

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Deployment
- GitHub
- Render
- MongoDB Atlas

## 📂 Project Structure

```text
Personal-Expense-Tracker/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   └── transactions.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── transactions.html
│
├── .gitignore
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/rahulraj2007k-pixel/Personal-Expense-Tracker.git
```

### 2. Open the project

```bash
cd Personal-Expense-Tracker
```

### 3. Install backend dependencies

```bash
npm install --prefix backend
```

### 4. Configure environment variables

Create:

```text
backend/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 5. Start the server

```bash
node backend/server.js
```

### 6. Open in browser

```text
http://localhost:5000
```

## 🔐 Security

Sensitive environment variables are stored in `.env` and are excluded from Git using `.gitignore`.

## 👨‍💻 Author

**Rahul Kumar**

Personal Expense Tracker — Full Stack Web Development Project.