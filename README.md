# 📌 Task Management Web Application (MERN Stack)

A full-stack Task Management System built using the MERN stack that allows users to securely manage their daily tasks with authentication, CRUD operations, filtering, sorting, and search functionality.

---

## 🚀 Live Demo

🔗 Frontend (Vercel): https://your-frontend-url.vercel.app  
🔗 Backend (Render): https://your-backend-url.onrender.com  
🔗 GitHub Repository: https://github.com/Shrija1604/task-management-app  

---

## 📖 Project Overview

This project is a **full-stack task management web application** where users can:

- Register and log in securely
- Create, update, delete tasks
- Filter and search tasks
- Track task status (Pending / In Progress / Completed)
- Manage personal productivity efficiently

The system uses **JWT authentication** to secure APIs and ensures only authenticated users can access task operations.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Token-based Authentication
- Protected Routes
- Secure Logout

### 📝 Task Management
- Create new tasks
- View all tasks
- Update existing tasks
- Delete tasks
- Mark task status

### 🔍 Advanced Features
- Task Filtering (Status-based)
- Task Sorting (Newest, Oldest, Due Date)
- Search Tasks by Title
- Real-time UI updates

### 📱 UI Features
- Responsive design (mobile + desktop)
- Clean and modern UI
- Interactive components
- Form validation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS / Bootstrap / Tailwind

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- bcrypt.js

### Deployment
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  
- Version Control: GitHub  

---

## 📁 Project Structure
task-management-app/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ ├── server.js
│ └── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── styles/
│ │ └── App.js
│ ├── public/
│ └── .env.example
│
└── README.md


---

## ⚙️ Installation & Setup

### 🔧 Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

---

## 🖥️ Backend Setup

```bash
cd backend
npm install
Create .env file
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Run backend server
npm start

Backend runs at:

http://localhost:5000
🌐 Frontend Setup
cd frontend
npm install
Create .env file
REACT_APP_API_URL=http://localhost:5000
Run frontend
npm start

Frontend runs at:

http://localhost:3000
🔗 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
Tasks
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
POST	/api/tasks	Create task
PUT	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
🔐 Authentication Flow
User registers or logs in
Server generates JWT token
Token is stored in frontend (localStorage)
Token is sent in headers for protected routes
Backend verifies token before granting access
📸 Screenshots

Add screenshots here before submission

Login Page
Register Page
Task Dashboard
Add Task Form
Filter/Search Feature
🚀 Deployment
Backend (Render)
Connected GitHub repository
Environment variables configured
Auto-deployment enabled
Frontend (Vercel)
Connected GitHub repository
Build command: npm run build
Environment variable: REACT_APP_API_URL
🧪 Testing

The application was tested using:

Postman (API testing)
Browser DevTools (Network inspection)
Manual UI testing
Test Cases Covered:
User authentication
Task CRUD operations
JWT token validation
Protected routes
Error handling
⚠️ Error Handling
Invalid login credentials handled
Unauthorized access blocked
API failure messages displayed
Network error handling implemented
🔮 Future Enhancements
Drag & Drop task management
Task reminders / notifications
Role-based access (Admin/User)
Dark mode UI
Analytics dashboard
Team collaboration features
👨‍💻 Author

Shrija1604

GitHub: https://github.com/Shrija1604

Project: Task Management Web Application (MERN Stack)

📌 Conclusion

This project demonstrates a complete full-stack application using the MERN stack with authentication, database integration, and deployment. It provides a scalable foundation for real-world task management systems.