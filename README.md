# HRMS Lite

HRMS Lite is a lightweight Human Resource Management System built as a full-stack web application.
The system allows an admin to manage employee records and track daily attendance through a clean and simple interface.

The goal of this project is to demonstrate full-stack development skills including frontend development, backend API design, database integration, validations, and deployment.

---

## Live Demo

Frontend:
https://hrms-lite-project-ebon.vercel.app

Backend API:
https://hrms-backend-t70r.onrender.com

API Documentation (Swagger):
https://hrms-backend-t70r.onrender.com/docs

---

## Features

### Employee Management

* Add a new employee
* View all employees
* Delete an employee
* Prevent duplicate employee IDs

### Attendance Management

* Mark daily attendance for employees
* Attendance status options:

  * Present
  * Absent
  * Half Day
  * Late
* Prevent marking attendance multiple times for the same employee on the same date
* Prevent marking attendance for non-existing employees
* View attendance records for each employee

### UI Features

* Modern responsive interface
* Loading states
* Error notifications using toast messages
* Empty state handling
* Reusable UI components

---

## Tech Stack

### Frontend

* React (Vite)
* Axios
* Tailwind CSS
* React Hooks

### Backend

* Python
* FastAPI
* Pydantic
* Motor (Async MongoDB Driver)

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```
hrms-lite-project
│
├── backend
│   ├── main.py
│   ├── database.py
│   ├── routers
│   │   ├── employees.py
│   │   └── attendance.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── pages
│   │   ├── components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Running the Project Locally

### 1. Clone the Repository

```
git clone https://github.com/aliazhar24/hrms-lite-project.git
cd hrms-lite-project
```

---

### 2. Backend Setup

Navigate to the backend folder:

```
cd backend
```

Create a virtual environment:

```
python -m venv venv
```

Activate the virtual environment:

Mac / Linux

```
source venv/bin/activate
```

Windows

```
venv\Scripts\activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```
MONGO_URL=your_mongodb_connection_string
DB_NAME=hrms
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```
uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## API Endpoints

### Employee APIs

```
POST /employees
GET /employees
DELETE /employees/{employee_id}
GET /employees/count
```

### Attendance APIs

```
POST /attendance
GET /attendance/{employee_id}
GET /attendance/today/summary
```

---

## Validation & Error Handling

The backend includes server-side validations such as:

* Required fields validation
* Valid email format validation
* Duplicate employee ID prevention
* Prevent duplicate attendance entries for the same date
* Error handling with proper HTTP status codes
* Meaningful error messages returned to the frontend

---

## Assumptions & Limitations

* The system assumes a single admin user (no authentication implemented).
* Employee roles and permissions are not included.
* Attendance editing or updating is not implemented.
* Payroll, leave management, and other HR features are outside the scope.
* The application is designed as a lightweight internal HR tool.

---

## Author

Ali Azhar

GitHub:
https://github.com/aliazhar24
