# Smart Task Hub: Project Documentation

## 1. Title Page
**Project Name:** Smart Task Hub
**Project Type:** Premium Full-Stack Task Management System
**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js), Tailwind CSS, Multer (File Uploads)

---

## 2. Index
1. Abstract
2. Problem Statement
3. Objectives
4. Scope
5. System Architecture
6. Database Design (ER Diagram)
7. Frontend Development
8. Backend Development
9. Integration
10. Testing (Test Cases & Defect Reports)
11. Results & Conclusion
12. Diagrams (Use Case, ER, Class, Activity, Sequence, DFD Level 0 & 1)
13. Future Enhancements
14. References & Appendices

---

## 3. Abstract
**Smart Task Hub** is a premium, full-stack task management application designed to bridge the gap between simple to-do lists and complex enterprise project management tools. It provides a highly visual, role-based environment where standard users can manage personal productivity via interactive drag-and-drop Kanban boards, integrated Pomodoro timers, dynamic calendars, and data-driven statistics. Administrators can moderate users, control system-wide categories, and monitor global activity through a secure console. Users can also maintain a rich personal profile including bio, date of birth, gender, phone number, and address details.

---

## 4. Problem Statement
Traditional task management applications often suffer from:
- **Lack of Role Separation**: Minimal distinction between regular users and system administrators.
- **Poor Visual Feedback**: Text-heavy interfaces with little data visualization.
- **Rigid Categorization**: Inability to define and color-code custom categories system-wide.
- **Insecure Recovery**: Non-functional or poorly designed password recovery flows.
- **Minimal User Profiles**: No support for extended personal details like contact info or address.

---

## 5. Objectives
- **Role-Based Access Control (RBAC)**: Distinct interfaces for Users and Admins.
- **Real-Time Notifications**: System-level alerts for user actions.
- **Data Visualization**: Graphs and charts for productivity tracking.
- **Responsive Premium Design**: A state-of-the-art UI with glassmorphism and smooth animations.
- **Security**: Robust JWT authentication and secure password reset mechanisms.
- **Extended Profiles**: Users can store personal details (DOB, gender, phone, bio, address).

---

## 6. Scope
- **User Module**: Task CRUD via Drag-and-Drop Kanban Board, Extended Profile Management (name, email, DOB, gender, phone, bio, address), Advanced Statistics (Recharts), FullCalendar integration, Pomodoro Timer focus mode, Attachments (Local File Uploads & External URLs), and Personal Notes.
- **Admin Module**: User moderation, System-wide Task monitoring, Global Category management, System Insights Dashboard.
- **Auth Module**: Secure Login/Register, Admin Secure Portal, Forgot Password (SMTP Integration).
- **Database**: MongoDB for persistent storage of Users, Tasks, Categories, Notifications, Attachments, Notes, and Focus Sessions.

---

## 7. System Architecture

```mermaid
graph TD
    subgraph "Frontend (React.js)"
        UI[User Interface]
        RC[React Components]
        RS[State Management / Axios Services]
    end

    subgraph "Backend (Node.js & Express)"
        API[RESTful API Endpoints]
        MW[Auth & Upload Middleware]
        CTRL[Business Logic Controllers]
        FS[Local File System - uploads/]
    end

    subgraph "Database (MongoDB)"
        DB[(MongoDB Atlas)]
    end

    UI --> RC
    RC --> RS
    RS -- "Axios Requests & FormData" --> API
    API --> MW
    MW --> CTRL
    CTRL --> DB
    CTRL --> FS
```

---

## 8. Database Design (ER Diagram)

```mermaid
erDiagram
    USER ||--o{ TASK : creates
    USER ||--o{ NOTIFICATION : receives
    CATEGORY ||--o{ TASK : classifies
    TASK ||--o{ FOCUS_SESSION : tracks
    TASK ||--o{ ATTACHMENT : includes
    TASK ||--o{ NOTE : has

    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string role "user / admin"
        string profileImage
        date dateOfBirth
        string gender "male / female / prefer-not-to-say"
        string phone
        string bio
        string address_city
        string address_state
        string address_country
        string address_pincode
        string themePreference "light / dark"
        string viewPreference "list / kanban"
        date createdAt
        date updatedAt
    }

    TASK {
        ObjectId _id PK
        string title
        string description
        string status "To Do / In Progress / Done"
        string priority "Low / Medium / High / Urgent"
        string category
        date dueDate
        string dueTime
        number pomodoroSessions
        ObjectId user FK
        date createdAt
        date updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        string name
        string color
        string icon
        string description
        boolean isDefault
        date createdAt
        date updatedAt
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId user FK
        string title
        string message
        string type "info / success / warning / error / task"
        boolean isRead
        string link
        date createdAt
    }

    FOCUS_SESSION {
        ObjectId _id PK
        number duration
        date startTime
        boolean completed
        ObjectId task FK
        date createdAt
    }

    ATTACHMENT {
        ObjectId _id PK
        string fileName
        string fileUrl
        number fileSize
        ObjectId task FK
        date createdAt
        date updatedAt
    }

    NOTE {
        ObjectId _id PK
        string content
        ObjectId task FK
        date createdAt
        date updatedAt
    }
```

---

## 9. Diagrams

### 9.1 Use Case Diagram

```
Actors: User, Admin
User Use Cases:
  - Register / Login
  - Manage Personal Tasks (Create, View, Update, Delete)
  - View Kanban Board / Calendar
  - Track Productivity Stats
  - Manage Profile (Personal Info, Contact, Address, Security)
  - Manage Attachments & Notes on Tasks
  - Run Pomodoro Focus Session
  - View / Read Notifications
  - Reset Password

Admin Use Cases:
  - Login (Admin Portal)
  - Manage All Users (View, Delete)
  - Monitor System Tasks (View, Delete)
  - Manage Global Categories (Create, Delete)
  - View System Insights (Stats Dashboard)
  - Manage Own Profile
```

### 9.2 Class Diagram

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        -String password
        +String role
        +String themePreference
        +String viewPreference
        +String profileImage
        +Date dateOfBirth
        +String gender
        +String phone
        +String bio
        +Object address
        +register()
        +login()
        +logout()
        +updateProfile()
        +deleteAccount()
        +forgotPassword()
        +resetPassword()
    }

    class Task {
        +ObjectId _id
        +String title
        +String description
        +String status
        +String priority
        +String category
        +Date dueDate
        +String dueTime
        +Number pomodoroSessions
        +ObjectId user
        +createTask()
        +viewTask()
        +updateTask()
        +deleteTask()
    }

    class Category {
        +ObjectId _id
        +String name
        +String color
        +String icon
        +String description
        +Boolean isDefault
        +createCategory()
        +deleteCategory()
        +getAllCategories()
    }

    class Notification {
        +ObjectId _id
        +String title
        +String message
        +String type
        +Boolean isRead
        +String link
        +ObjectId user
        +sendAlert()
        +markAsRead()
        +deleteNotification()
    }

    class FocusSession {
        +ObjectId _id
        +Number duration
        +Date startTime
        +Boolean completed
        +ObjectId task
        +startSession()
        +endSession()
        +getSessions()
    }

    class Attachment {
        +ObjectId _id
        +String fileName
        +String fileUrl
        +Number fileSize
        +ObjectId task
        +addAttachment()
        +deleteAttachment()
        +getAttachmentsByTask()
    }

    class Note {
        +ObjectId _id
        +String content
        +ObjectId task
        +addNote()
        +updateNote()
        +deleteNote()
    }

    User "1" --> "*" Task : creates
    User "1" --> "*" Notification : receives
    Task "*" --> "1" Category : classified_by
    Task "1" --> "*" FocusSession : tracks
    Task "1" --> "*" Attachment : includes
    Task "1" --> "*" Note : has
```

### 9.3 Activity Diagram (Authentication Flow)

```mermaid
stateDiagram-v2
    [*] --> LandingPage
    LandingPage --> LoginPage : Click Login
    LandingPage --> RegisterPage : Click Register

    RegisterPage --> ValidateInput : Submit Form
    ValidateInput --> RegisterPage : Validation Failed
    ValidateInput --> CreateUser : Validation Passed
    CreateUser --> UserDashboard : Role = user

    LoginPage --> AuthCheck : Submit Credentials
    AuthCheck --> LoginPage : Invalid Credentials
    AuthCheck --> UserDashboard : Valid - Role = user
    AuthCheck --> AdminDashboard : Valid - Role = admin

    UserDashboard --> [*]
    AdminDashboard --> [*]
```

### 9.4 Data Flow Diagrams (DFD)

#### Level 0 — Context Diagram

```mermaid
graph LR
    User(["👤 User"])
    Admin(["🛡️ Admin"])
    System["Smart Task Hub System"]

    User -- "Register / Login\nCreate & Manage Tasks\nUpload Attachments\nManage Profile" --> System
    System -- "JWT Token\nTask Views & Stats\nNotifications" --> User

    Admin -- "Login\nManage Users & Tasks\nManage Categories\nView Insights" --> System
    System -- "User List & Task Data\nSystem Insights" --> Admin
```

#### Level 1 DFD

```mermaid
graph TD
    User(["👤 User"])
    Admin(["🛡️ Admin"])

    D1[(D1: User Store)]
    D2[(D2: Task Store)]
    D3[(D3: Category Store)]
    D4[(D4: Attachment Store\n+ File System)]
    D5[(D5: Note Store)]
    D6[(D6: FocusSession Store)]
    D7[(D7: Notification Store)]

    P1["1.0 Registration & Login"]
    P2["2.0 Task Management"]
    P3["3.0 Category Management"]
    P4["4.0 Attachment Management"]
    P5["5.0 Notes Management"]
    P6["6.0 Focus Session Management"]
    P7["7.0 Notification Management"]
    P8["8.0 Admin Management"]

    User -- "Name, Email, Password" --> P1
    P1 -- "JWT Token + Role" --> User
    P1 -- "Store / Validate User" --> D1

    User -- "Task Details (Title, Due Date, Priority)" --> P2
    P2 -- "Task Views / Kanban Board" --> User
    P2 -- "CRUD Operations" --> D2

    User -- "File Upload or URL" --> P4
    P4 -- "File Info + URL" --> User
    P4 -- "Store Metadata" --> D4
    P4 -- "Link to Task" --> D2

    User -- "Note Content" --> P5
    P5 -- "Note Data" --> User
    P5 -- "Store / Retrieve Notes" --> D5
    P5 -- "Link to Task" --> D2

    User -- "Start / End Pomodoro" --> P6
    P6 -- "Session Stats" --> User
    P6 -- "Store Session" --> D6
    P6 -- "Increment pomodoroSessions" --> D2

    P7 -- "Alerts & System Messages" --> User
    P7 -- "Store / Mark Read / Delete" --> D7
    D7 -- "Unread Notifications" --> P7

    Admin -- "Create / Delete Category" --> P3
    P3 -- "Category List" --> User
    P3 -- "CRUD Operations" --> D3

    Admin -- "Manage Users / Tasks / Insights" --> P8
    P8 -- "User List + Stats + System Tasks" --> Admin
    P8 -- "Read / Delete Users" --> D1
    P8 -- "Read / Delete All Tasks" --> D2
```

### 9.5 Sequence Diagram (Task Creation Flow)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React UI
    participant Backend as Node API
    participant DB as MongoDB

    User->>Frontend: Fill task form & click Submit
    Frontend->>Backend: POST /api/tasks (with JWT header)
    Backend->>Backend: Verify JWT Token (authMiddleware)
    Backend->>DB: Insert new Task document
    DB-->>Backend: Return created Task object
    Backend-->>Frontend: 201 Created + Task data
    Frontend->>Frontend: Update local state / Kanban board
    Frontend-->>User: Display new task card on board
```

---

## 10. Testing & QA

### 10.1 Test Cases
| ID | Test Scenario | Expected Result | Status |
|---|---|---|---|
| TC01 | Admin Login with user credentials | Access denied — redirected to user login | Passed |
| TC02 | Create task with no due date | Task created with null due date | Passed |
| TC03 | Forgot Password Email trigger | Reset URL sent via SMTP / logged | Passed |
| TC04 | Sidebar scroll with 10+ tasks | Footer remains sticky/visible | Passed |
| TC05 | Delete user account | All associated tasks deleted | Passed |
| TC06 | Upload local PDF/Image attachment | File saved, URL linked to task | Passed |
| TC07 | Update profile with DOB, gender, address | All fields saved and reflected in UI | Passed |
| TC08 | Password mismatch on profile security tab | Inline error shown, save blocked | Passed |

### 10.2 Defect Reports
- **Issue:** Forgot Password UI mismatching theme.
  **Resolution:** Updated `ForgotPasswordPage.js` to dual-column premium layout.
- **Issue:** Sidebar logout button hidden on small screens.
  **Resolution:** Implemented `overflow-y: auto` and sticky footer in `main.css`.
- **Issue:** Profile page lacked personal details (DOB, gender, address, phone, bio).
  **Resolution:** Extended `User` model with new fields; redesigned `ProfilePage.js` with 3-tab layout.

---

## 11. Future Enhancements
1. **Real-time Chat**: Collaboration tools for team-based tasks.
2. **Mobile App**: Native iOS/Android versions using React Native.
3. **AI Task Assistant**: Automated priority suggestions based on user habits.
4. **Third-party Integrations**: Sync with Google Calendar and Slack.
5. **Social Login**: Google / GitHub OAuth support.

---

## 12. Conclusion
**Smart Task Hub** successfully delivers a professional-grade task management experience. By combining a robust MERN backend with a high-fidelity React frontend, the project meets all initial objectives of role-based management, security, and data visualization. The extended user profile system, Pomodoro timer, file attachments, and personal notes make it a comprehensive productivity platform. It stands as a scalable foundation for future enterprise productivity features.

---