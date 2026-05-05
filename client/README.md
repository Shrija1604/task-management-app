# 📝 Task Management App (MERN Stack)

A full-stack Task Management Application built using the MERN stack (MongoDB, Express, React, Node.js).  
This project allows users to register, login, and manage tasks with full CRUD functionality.

---

## 🚀 Features

### 👤 Authentication
- User Registration
- User Login (JWT Authentication)
- Protected Routes
- Secure Password Hashing (bcrypt)

### 📋 Task Management
- Create Task
- View All Tasks
- Update Task
- Delete Task
- Mark Task as Completed / Pending

### 🎨 Frontend Features
- Responsive UI using React
- Clean component-based structure
- Task dashboard
- Login page
- Navbar navigation

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- React Router DOM
- CSS

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js

---


---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Shrija1604/task-management-app.git

2. Backend Setup
cd task-management-appnpm installnpm run dev

Create .env file:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000

3. Frontend Setup
cd clientnpm installnpm start

🔗 API Endpoints
Auth Routes
POST /api/auth/registerPOST /api/auth/login
Task Routes (Protected)
GET    /api/tasksPOST   /api/tasksPUT    /api/tasks/:idDELETE /api/tasks/:id


🔐 Authentication Flow
User registers/logs in

Server generates JWT token

Token stored in localStorage

Token sent with every API request

Backend validates token using middleware



📌 Future Improvements
Task search functionality
Task filtering (status-based)
Task sorting (date-based)
Drag & drop UI
Deployment (Vercel + Render)


👨‍💻 Author
Developed as part of MERN Stack learning project.

📸 Screenshots
(Add your UI screenshots here)

✅ Status
✔ Backend Complete
✔ Frontend Complete
✔ Authentication Working
✔ CRUD Working
✔ Project Ready for Submission

---# 🟢 FINAL RESULT AFTER THISYour project will be:✔ Clean GitHub repo  ✔ Professional README  ✔ No unnecessary files  ✔ Submission-ready MERN project  ✔ Viva-ready explanation  ---# 🚀 If you want next upgradeI can help you:👉 add search + filter (Task 5 full completion)  👉 make UI look like real SaaS app  👉 prepare viva questions + answers  👉 deployment guide (very important for marks)Just say:👉 **“final viva + deployment”**