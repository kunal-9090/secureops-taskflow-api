# SecureOps TaskFlow API

Full-stack secure task/workflow management app with JWT access tokens, refresh tokens, RBAC (user/admin), task CRUD with user soft-delete, admin APIs, audit logs, Swagger docs, Postman collection, Docker, and a basic React UI.

---

## Project Structure
- `secureops-taskflow/backend` — Node.js/Express API (MongoDB + Mongoose)
- `secureops-taskflow/frontend` — React (Vite) UI
- `secureops-taskflow/postman` — Postman collection
- Root `README.md` — setup + security + scalability + submission checklist

---

## Prerequisites
- Node.js 20+
- npm
- Docker Desktop (optional, but required for the included docker-compose flow)

---

## Run Backend (Local, independently)

### 1) Configure environment
Backend expects environment variables via `secureops-taskflow/backend/.env` or `secureops-taskflow/backend/.env.example`.

Copy/adjust:
- `secureops-taskflow/backend/.env.example` → `secureops-taskflow/backend/.env`

Key env vars:
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

### 2) Install & run
```bash
cd secureops-taskflow/backend
npm install
npm run dev
```

### Seed admin
```bash
cd secureops-taskflow/backend
npm run seed:admin
```

### Health check
- `GET http://localhost:5000/api/v1/health`

### Swagger
- `GET http://localhost:5000/api-docs`

---

## Run Frontend (Local, independently)

```bash
cd secureops-taskflow/frontend
npm install
npm run dev
```

Frontend will run on:
- `http://localhost:5173`

> The UI uses `localStorage.accessToken` for API calls.

---

## Run Everything with Docker (Backend + MongoDB)

From repo root (where `docker-compose.yml` is present):

```bash
docker-compose up --build
```

Then seed admin (inside backend container or run locally with the same env):

```bash
cd secureops-taskflow/backend
npm run seed:admin
```

---

## Authentication (JWT + Refresh Tokens)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login` → returns:
  - `accessToken`
  - `refreshToken`
- `POST /api/v1/auth/refresh-token` → returns new `accessToken`
- `POST /api/v1/auth/logout`
- `GET  /api/v1/auth/profile`

Authorization:
- Send access token as:
  - `Authorization: Bearer <accessToken>`

Refresh token support:
- Refresh token is stored on the user document (`User.refreshToken`).

---

## Role-Based Access Control (RBAC)
- Roles:
  - `user` (default)
  - `admin`
- Admin routes are restricted via `role.middleware.js`.

---

## Tasks API (CRUD)
All task routes require authentication.
- `GET    /api/v1/tasks` (query: `status`, `priority`, `search`, `page`, `limit`, `sort`)
- `POST   /api/v1/tasks`
- `GET    /api/v1/tasks/:id`
- `PUT    /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

Soft delete requirement:
- For normal users, deletion sets `task.isDeleted = true`.

---

## Admin APIs
Admin base: `/api/v1/admin`
- `GET    /admin/users`
- `GET    /admin/users/:id`
- `GET    /admin/tasks`
- `GET    /admin/stats`
- `PATCH  /admin/users/:id/status`
- `DELETE /admin/tasks/:id`
- `GET    /admin/audit-logs`

---

## Audit Logs
Security-relevant actions are written to `AuditLog` and retrievable via:
- `GET /api/v1/admin/audit-logs`

---

## Swagger + Postman
- Swagger: `GET http://localhost:5000/api-docs`
- Postman collection: `secureops-taskflow/postman/SecureOps_TaskFlow.postman_collection.json`

---

# Docker Notes / Scalability Notes
- Docker Compose provisions `backend` + `mongodb`.
- Backend structure is modular (controllers/services/models/middlewares/validators), enabling scale-out.
- MongoDB indexes are defined to support common filtering.
- Future scalability options:
  - Redis caching
  - message queues for async jobs
  - centralized observability (logs/metrics/tracing)

## Swagger availability
- The API always serves `/api-docs`.
- If no JSDoc annotations are present, a fallback spec is used so the docs are not empty.


---

## Submission Checklist (Final)
- [x] JWT access token authentication
- [x] Refresh token support
- [x] Role-Based Access Control (user/admin)
- [x] Task CRUD APIs
- [x] Soft delete for user task deletion
- [x] Admin APIs
- [x] Audit logs
- [x] Swagger documentation at `/api-docs`
- [x] Postman collection included
- [x] Health check endpoint
- [x] Docker + docker-compose setup
- [x] Basic React frontend UI

---

## Known Limitations
- Refresh token rotation/reuse-detection is not implemented (basic stored-token match only).
- Admin task delete is implemented as a hard delete (user task delete is soft delete).

