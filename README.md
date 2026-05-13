# 🚀 SmartTask Hub (MERN Stack)

SmartTask Hub is a professional-grade, full-stack task management platform built with the MERN stack. It features role-based dashboards, a visual calendar, dynamic themes, and production-optimized configurations.

---

## 🔗 Live Links

- **Frontend (Vercel):** [https://task-management-app-one-sepia.vercel.app](https://task-management-app-one-sepia.vercel.app)
- **Backend (Render):** [https://task-management-app-3v0i.onrender.com](https://task-management-app-3v0i.onrender.com)
- **GitHub Repository:** [https://github.com/Shrija1604/task-management-app](https://github.com/Shrija1604/task-management-app)

---

### 📊 Intelligent Dashboards
- **User Dashboard**: Real-time productivity metrics, completion rates, and priority alerts.
- **Admin Command Center**: System-wide statistics (Users, Tasks, Global Completion Rate) and user management.
- **Role-Based Access**: Specialized views for standard users and administrators.

### 📅 Visual Calendar
- **Interactive View**: Visualize deadlines and task distribution on a monthly calendar grid.
- **Task Management**: Create, view, and manage tasks directly from the calendar interface.

- **Priority Indicators**: Color-coded task dots for instant priority assessment.

### 🔐 Secure Authentication
- **Role-Based Access**: Specialized views for Administrators and standard Users.
- **JWT Protection**: Secure API endpoints with token-based authorization.
- **Secure Password Reset**: Full forgot/reset password flow with token-based verification.
- **Profile Management**: Set and update profile photos directly from your device.

---

## 🔑 Admin Credentials

For testing the Administrative Command Center:
- **Email**: `admin@gmail.com`
- **Password**: `Admin@123`

---

---

## 🛠️ Tech Stack

- **Frontend:** React, Context API, Axios, CSS Variables.
- **Backend:** Node.js, Express.js, MongoDB (Atlas), Mongoose.
- **Security:** JWT, BcryptJS, Protected Routes, CORS Optimization.
- **Deployment:** Vercel (Frontend), Render (Backend).

---

## 📁 Project Structure

```text
task-management-app/
├── backend/
│   ├── config/ (Database connection)
│   ├── controllers/ (Business logic)
│   ├── middleware/ (Auth & Admin guards)
│   ├── models/ (MongoDB schemas)
│   ├── routes/ (API endpoints)
│   └── server.js (Main entry point)
└── frontend/
    ├── src/
    │   ├── components/ (Reusable UI)
    │   ├── context/ (Theme management)
    │   ├── pages/ (Dashboard, Task, Auth)
    │   ├── services/ (API interaction)
    │   └── styles/ (Global theme system)
    └── vercel.json (SPA routing config)
```

---

## ⚙️ Setup & Deployment

### Environment Variables

#### Frontend (.env)
```text
REACT_APP_API_URL=https://task-management-app-3v0i.onrender.com/api
```

#### Backend (.env)
```text
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://task-management-app-one-sepia.vercel.app
PORT=5000

# Email Config (Optional for real emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

---

## 👨‍💻 Author

**Shrija1604**
- GitHub: [@Shrija1604](https://github.com/Shrija1604)

---

📌 **Conclusion**: SmartTask Hub demonstrates a production-ready MERN application with a focus on UI excellence, role-based functionality, and scalable architecture.