# ✦ Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

🔗 **Live Demo:** [https://team-task-manager-peach-gamma.vercel.app](https://team-task-manager-peach-gamma.vercel.app)  
📦 **Backend API:** [https://team-task-manager-production-e1e6.up.railway.app](https://team-task-manager-production-e1e6.up.railway.app)

---

## 📋 Features

- **Authentication** — Signup and Login with JWT tokens
- **Role-Based Access Control** — Admin and Member roles with different permissions
- **Project Management** — Admins can create and manage projects
- **Task Management** — Create tasks, assign due dates, link to projects
- **Kanban Board** — Visual task tracking across To Do → In Progress → Done
- **Dashboard Stats** — Live counts for total, in-progress, completed, and overdue tasks
- **Overdue Detection** — Automatic warning when tasks pass their due date

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | SQLite |
| Authentication | JWT (JSON Web Tokens) |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed
- Git installed

### 1. Clone the repository

```bash
git clone https://github.com/aniljoshi121/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Setup Backend

```bash
cd backend
npm install
node index.js
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## 🔐 Role-Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| Sign Up / Login | ✅ | ✅ |
| View Dashboard | ✅ | ✅ |
| View Tasks | ✅ | ✅ |
| Update Task Status | ✅ | ✅ |
| Create Tasks | ✅ | ✅ |
| Delete Tasks | ✅ | ❌ |
| Create Projects | ✅ | ❌ |
| View Projects | ✅ | ✅ |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get token |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project (Admin only) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete task (Admin only) |

---

## 📁 Project Structure

```
Team-Task-Manager/
├── backend/
│   ├── index.js          # Express server entry point
│   ├── routes/           # API route handlers
│   ├── middleware/        # Auth & role middleware
│   └── database.db       # SQLite database
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── Dashboard.js
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🌐 Deployment

- **Frontend** deployed on [Vercel](https://vercel.com)
- **Backend** deployed on [Railway](https://railway.app)

---

## 👤 Author

**Anil Joshi**  
GitHub: [@aniljoshi121](https://github.com/aniljoshi121)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).