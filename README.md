# 💼 Employee Task Management Dashboard

A full-stack company internal web application built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**. Designed for interview evaluation and real-world team operations management.

---

## 🌟 Key Features

1. **🔐 Authentication & Access Control**
   - JWT-based authentication for Admin access.
   - Protected routes in React with persistent session state.
   - One-click Admin demo credentials fill on the login screen.

2. **📊 Executive Dashboard**
   - Live metrics summary: Total Employees, Total Tasks, Pending, In Progress, Completed.
   - Interactive Task Completion Rate progress bar.
   - Recent Activity Feed & Quick action shortcuts.

3. **👥 Employee Management (CRUD)**
   - View employee directory with active task counts and completion stats.
   - Add new employees with name, work email, position, and department.
   - Edit employee details or delete employees with cascading task cleanup.
   - Real-time search and department filtering.

4. **⚡ Task Assignment & Status Workflow**
   - Create tasks with description, priority (`High`, `Medium`, `Low`), due date, and status.
   - Assign tasks to specific employees via relational MongoDB `ObjectId` references.
   - Quick inline status toggle dropdown (`Pending` → `In Progress` → `Completed`).
   - Advanced task filtering by Employee, Status, Priority, and Search keyword.

5. **⚡ Zero-Config Database Fallback**
   - Automatically connects to local/remote MongoDB if configured in `.env`.
   - Automatically launches an embedded `mongodb-memory-server` if no local database is running, enabling instant out-of-the-box startup on any machine!

---

## 📐 Architecture Overview

```text
                  USER
                   │
                   ▼
       React.js Frontend (Vite)
       [Port 3000 | Custom Glassmorphism UI]
                   │
                HTTP / REST API (JWT)
                   │
                   ▼
        Node.js + Express Backend
       [Port 5000 | Modular Controllers & Routes]
                   │
                Mongoose ODM
                   │
                   ▼
           MongoDB Database
       [Embedded Memory Fallback / MongoDB Atlas]
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. One-Command Setup
Install all dependencies for backend, frontend, and seed the database with test data:

```bash
npm run setup
```

### 2. Launch Application
Start both backend (Express on port 5000) and frontend (Vite on port 3000) concurrently:

```bash
npm start
```

Then open your browser at:
👉 **`http://localhost:3000`**

---

## 🔑 Default Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@company.com` | `password123` |

*(Note: You can click the **"Auto-fill Credentials"** button on the Login page for 1-click authentication).*

---

## 🔌 API Endpoint Specifications

### 1. Authentication
- `POST /api/auth/login` - Authenticate admin & receive JWT token.
- `GET /api/auth/me` - Get current user profile.

### 2. Employee Endpoints
- `GET /api/employees` - List all employees with task workload statistics.
- `POST /api/employees` - Create a new employee record.
- `PUT /api/employees/:id` - Update employee details.
- `DELETE /api/employees/:id` - Delete employee & associated tasks.

### 3. Task Endpoints
- `GET /api/tasks?employee=:id&status=:status&priority=:priority&search=:query` - Filtered task listing with populated employee details.
- `POST /api/tasks` - Create new task assigned to an employee.
- `PUT /api/tasks/:id` - Update task title, assignment, priority, due date, or status.
- `DELETE /api/tasks/:id` - Delete a task.

### 4. Dashboard Metrics
- `GET /api/dashboard/stats` - Fetch total counts for employees, total tasks, status breakdowns, and completion rate.

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

### Employee Schema
```javascript
{
  name: String,
  email: { type: String, unique: true },
  position: String,
  department: String,
  avatarUrl: String,
  createdAt: Date
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  assignedEmployee: { type: ObjectId, ref: 'Employee' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  dueDate: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'] },
  createdAt: Date
}
```

---

## 🎥 Video Presentation Script (For Interview Submission)

When recording your demo video, follow this 7-step presentation flow:

1. **Introduction (10s)**:
   > *"Hi, this is my Employee Task Management Dashboard built with React, Node.js, Express, and MongoDB."*

2. **Login (15s)**:
   > *"I'll log in as the Admin using JWT authentication."* (Click Auto-fill & Sign in).

3. **Dashboard Overview (20s)**:
   > *"The dashboard displays live operational stats: total employees, total tasks, and a breakdown of pending, in-progress, and completed tasks alongside a completion rate progress bar."*

4. **Employee Operations (30s)**:
   > *"Under Employees, we can view staff members and their active workloads. Let's add a new employee: 'Sara Designer' as UI/UX Lead."*

5. **Task Creation & Assignment (30s)**:
   > *"Now in Tasks, let's create a high-priority task 'Design Mobile App' and assign it directly to Sara."*

6. **Live Status Workflow & Metrics Update (30s)**:
   > *"Let's change the task status from Pending -> In Progress -> Completed. Notice how the status badge updates inline, and returning to the Dashboard shows our completion rate automatically increase!"*

7. **Filters & Conclusion (15s)**:
   > *"We can filter tasks by specific employees or statuses. All data is persisted in MongoDB via REST APIs."*
