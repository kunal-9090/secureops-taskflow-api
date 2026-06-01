# SecureOps TaskFlow API

SecureOps TaskFlow API is a full-stack role-based task and workflow management system built to demonstrate secure REST API design, authentication, authorization, task CRUD operations, admin controls, audit logging, API documentation, Docker-based setup, and frontend integration.

This project was built as a Backend Developer Internship assignment with a primary focus on scalable backend architecture and a basic React frontend for testing and interacting with the APIs.

---

## Project Highlights

* Secure user registration and login
* Password hashing using bcrypt
* JWT access token authentication
* Refresh token support
* Role-Based Access Control for `user` and `admin`
* Task CRUD APIs with ownership protection
* Soft delete for normal user task deletion
* Admin APIs for users, tasks, stats, and audit logs
* Centralized error handling
* Input validation
* API versioning with `/api/v1`
* Swagger documentation at `/api-docs`
* Postman collection included
* Docker and docker-compose setup
* Basic React frontend UI
* Health check endpoint
* Modular backend structure for scalability

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Zod / validation middleware
* Swagger UI
* Docker
* Morgan / logging middleware
* Helmet / security middleware
* CORS

### Frontend

* React.js
* Vite
* Axios
* React Router
* CSS

### Tools

* Postman
* Docker Desktop
* MongoDB Atlas / Local MongoDB
* GitHub

---

## Project Structure

```txt
secureops-taskflow/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   └── package.json
│
├── postman/
│   └── SecureOps_TaskFlow.postman_collection.json
│
├── screenshots/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Prerequisites

Before running the project, make sure you have:

* Node.js 20 or above
* npm
* MongoDB Atlas account or local MongoDB
* Docker Desktop, optional but recommended
* Git

---

## Environment Variables

Create a `.env` file inside the `backend/` folder.

You can copy the sample file:

```bash
cd secureops-taskflow/backend
cp .env.example .env
```

Example backend environment variables:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/secureops-taskflow

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173

BCRYPT_SALT_ROUNDS=10

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/secureops-taskflow?retryWrites=true&w=majority
```

Important: Do not commit `.env` to GitHub. Only `.env.example` should be committed.

---

## Backend Setup

Go to the backend folder:

```bash
cd secureops-taskflow/backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```

---

## Seed Admin User

To create an admin user, run:

```bash
cd secureops-taskflow/backend
npm run seed:admin
```

Admin credentials are taken from the `.env` file:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd secureops-taskflow/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## Docker Setup

Docker Compose can run the backend and MongoDB together.

From the root folder:

```bash
cd secureops-taskflow
docker-compose up --build
```

After Docker starts, check:

```txt
http://localhost:5000/api/v1/health
```

To stop containers:

```bash
docker-compose down
```

---

## Health Check

```http
GET /api/v1/health
```

Example response:

```json
{
  "success": true,
  "message": "SecureOps TaskFlow API is running",
  "timestamp": "2026-06-01T00:00:00.000Z"
}
```

---

## API Documentation

Swagger documentation is available at:

```txt
http://localhost:5000/api-docs
```

The project also includes a Postman collection:

```txt
postman/SecureOps_TaskFlow.postman_collection.json
```

Swagger includes documentation for:

* Authentication APIs
* Task APIs
* Admin APIs
* Health check API
* Bearer token authentication

---

## API Versioning

All APIs are versioned using:

```txt
/api/v1
```

Example:

```txt
POST /api/v1/auth/login
GET /api/v1/tasks
GET /api/v1/admin/stats
```

---

## Authentication APIs

| Method | Endpoint                     | Description                | Access        |
| ------ | ---------------------------- | -------------------------- | ------------- |
| POST   | `/api/v1/auth/register`      | Register new user          | Public        |
| POST   | `/api/v1/auth/login`         | Login user                 | Public        |
| POST   | `/api/v1/auth/refresh-token` | Generate new access token  | Public        |
| POST   | `/api/v1/auth/logout`        | Logout user                | Authenticated |
| GET    | `/api/v1/auth/profile`       | Get logged-in user profile | Authenticated |

Authorization header format:

```txt
Authorization: Bearer <accessToken>
```

---

## Task APIs

All task routes require authentication.

| Method | Endpoint            | Description                | Access      |
| ------ | ------------------- | -------------------------- | ----------- |
| GET    | `/api/v1/tasks`     | Get logged-in user's tasks | User/Admin  |
| POST   | `/api/v1/tasks`     | Create task                | User/Admin  |
| GET    | `/api/v1/tasks/:id` | Get single task            | Owner/Admin |
| PUT    | `/api/v1/tasks/:id` | Update task                | Owner/Admin |
| DELETE | `/api/v1/tasks/:id` | Delete task                | Owner/Admin |

Supported query parameters:

```txt
status=pending
priority=high
search=backend
page=1
limit=10
sort=createdAt
```

Example:

```txt
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
```

For normal users, task deletion is implemented as soft delete using:

```txt
isDeleted = true
```

---

## Admin APIs

Admin routes require authentication and `admin` role.

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/api/v1/admin/users`            | Get all users            |
| GET    | `/api/v1/admin/users/:id`        | Get single user          |
| PATCH  | `/api/v1/admin/users/:id/status` | Activate/deactivate user |
| GET    | `/api/v1/admin/tasks`            | Get all tasks            |
| DELETE | `/api/v1/admin/tasks/:id`        | Delete any task          |
| GET    | `/api/v1/admin/stats`            | Get dashboard stats      |
| GET    | `/api/v1/admin/audit-logs`       | Get audit logs           |

---

## Audit Logging

The system records security-relevant actions in the `AuditLog` collection.

Examples of logged actions:

* User registration
* User login
* Task creation
* Task update
* Task deletion
* Admin user status update
* Admin task deletion

Admin can view audit logs using:

```http
GET /api/v1/admin/audit-logs
```

---

## Role-Based Access Control

The project supports two roles:

```txt
user
admin
```

Default registered users are assigned the `user` role.

Role restrictions are handled using middleware:

```txt
auth.middleware.js
role.middleware.js
```

Normal users can only access and modify their own tasks.

Admins can access admin dashboards, users, all tasks, stats, and audit logs.

---

## Security Practices Implemented

* Passwords are hashed using bcrypt before storing in the database.
* JWT access tokens are used to protect private routes.
* Refresh tokens are supported for generating new access tokens.
* Role-based middleware restricts admin-only APIs.
* User inputs are validated before processing.
* Sensitive credentials are managed through environment variables.
* `.env` files are excluded from Git tracking.
* Helmet is used to improve HTTP security headers.
* CORS is configured for frontend-backend communication.
* Centralized error handling is implemented.
* Passwords are never returned in API responses.
* Normal user task deletion uses soft delete.

---

## Scalability Notes

The backend follows a modular service-based architecture:

```txt
routes → controllers → services → models
```

This keeps business logic separated from request handling and makes the system easier to maintain and extend.

Scalability improvements supported by the current design:

* New modules can be added without modifying existing modules heavily.
* MongoDB indexes can improve query performance for user, task, and audit log queries.
* Redis can be added for caching frequently requested data.
* Message queues can be introduced for async jobs such as notifications or reports.
* Docker setup makes the backend easier to run in cloud environments.
* Load balancing can be added for horizontal scaling.
* Authentication and task services can later be separated into independent microservices.
* Centralized logging and monitoring can be added for production observability.

---

## Frontend Features

The React frontend provides a basic UI for interacting with the backend APIs.

Implemented pages/features:

* Register page
* Login page
* Protected dashboard
* Task creation
* Task listing
* Task update
* Task deletion
* Admin dashboard
* Logout
* API error/success message display

The frontend uses Axios to communicate with the backend and stores the access token in localStorage.

---

## Testing Flow

Recommended manual testing flow:

1. Start MongoDB or Docker.
2. Start backend.
3. Open health check endpoint.
4. Open Swagger docs.
5. Register a normal user.
6. Login and copy access token.
7. Create a task.
8. Get all tasks.
9. Update a task.
10. Delete a task.
11. Seed admin.
12. Login as admin.
13. Access admin users, tasks, stats, and audit logs.
14. Start frontend.
15. Test login, dashboard, and task CRUD from UI.

---

## Postman Testing

Import the Postman collection:

```txt
postman/SecureOps_TaskFlow.postman_collection.json
```

Recommended Postman environment variables:

```txt
base_url=http://localhost:5000
access_token=<your_access_token>
refresh_token=<your_refresh_token>
task_id=<created_task_id>
user_id=<user_id>
```

---

## Assignment Requirements Covered

| Requirement                    | Status    |
| ------------------------------ | --------- |
| User registration and login    | Completed |
| Password hashing               | Completed |
| JWT authentication             | Completed |
| Refresh token support          | Completed |
| Role-based access control      | Completed |
| CRUD APIs for secondary entity | Completed |
| API versioning                 | Completed |
| Error handling                 | Completed |
| Input validation               | Completed |
| Database schema                | Completed |
| Swagger documentation          | Completed |
| Postman collection             | Completed |
| Basic frontend UI              | Completed |
| Security practices             | Completed |
| Scalability note               | Completed |
| Docker setup                   | Completed |
| Admin APIs                     | Completed |
| Audit logs                     | Completed |

---

## Known Limitations

* Refresh token rotation and reuse detection are not implemented. Current implementation uses a basic stored-token match.
* Admin task deletion is implemented as hard delete. Normal user task deletion is soft delete.
* The frontend is intentionally simple because the assignment focuses mainly on backend API design.
* Production deployment links can be added after cloud deployment verification.

---

## Future Improvements

* Add refresh token rotation with reuse detection.
* Store refresh tokens in httpOnly cookies.
* Add Redis caching.
* Add rate limiting per user/IP.
* Add automated tests using Jest and Supertest.
* Add CI/CD pipeline using GitHub Actions.
* Add production logging with Winston or Pino.
* Add deployment on Render/Railway and Vercel.
* Add email notification support.
* Add advanced task analytics.

---

## Submission Note

This repository contains the complete source code, setup instructions, API documentation, Postman collection, Docker configuration, and frontend UI for the Backend Developer Internship assignment.

Live deployment links can be added to this README after final cloud deployment verification.
