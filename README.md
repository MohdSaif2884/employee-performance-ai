# AI-Based Employee Performance Analytics & Recommendation System

## Project Overview
A production-ready full-stack MERN application that enables HR/Admin users to manage employees and generate AI-based recommendations for promotion readiness, ranking, training suggestions, and performance feedback.

### Features
- Secure authentication (JWT + bcrypt)
- Employee CRUD operations
- Search employees by department
- Filter employees by department + performance score range
- Track employee performance (performanceScore, experience)
- Generate AI recommendations using OpenRouter/OpenAI-compatible API
- View employee rankings and analytics charts (Recharts)
- Protected routes and centralized error handling

## Tech Stack
- Frontend: React, React Router DOM, Axios, Tailwind CSS, Context API
- Backend: Node.js, Express.js (MVC)
- Database: MongoDB Atlas + Mongoose
- AI: OpenRouter/OpenAI compatible `chat/completions`
- Deployment: Render (backend + frontend)

---

## Folder Structure
```
root/
 ├── backend/
 ├── frontend/
 ├── Postman/
 ├── render.yaml
 ├── README.md
```

---

## Backend Setup
### 1) Install
```bash
cd backend
npm install
```

### 2) Environment variables
Create `backend/.env` based on `backend/.env.example`.

```bash
cp .env.example .env
```

### 3) Start backend (dev)
```bash
npm run dev
```

### Backend Health
- `GET /api/health`
- `GET /api/docs`

---

## Frontend Setup
### 1) Install
```bash
cd frontend
npm install
```

### 2) Environment variables
Create `frontend/.env` based on `frontend/.env.example`.

```bash
cp .env.example .env
```

### 3) Start frontend (dev)
```bash
npm run dev
```

---

## MongoDB Setup
1. Create MongoDB Atlas cluster
2. Use database name `employeeDB`
3. Update `MONGO_URI` in `backend/.env`

---

## OpenRouter / AI Setup
1. Create API key at OpenRouter
2. Set `OPENROUTER_API_KEY` in `backend/.env`
3. AI endpoint:
   `POST https://openrouter.ai/api/v1/chat/completions`

---

## Run Commands (Local)
In separate terminals:

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## API Endpoints
### Auth (no auth required)
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Employees (JWT required)
- `POST /api/employees`
- `GET /api/employees`
  - Optional query:
    - `department`
    - `minScore`
    - `maxScore`
- `GET /api/employees/:id`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/employees/search?department=Development`

### AI (JWT required)
- `POST /api/ai/recommend`
  - Body:
    - `mode`: `promotion | ranking | training | feedback`
    - `employeeIds`: optional array of employee Mongo IDs
    - `department`: optional department string

---

## Postman Samples
Import: `Postman/employee.postman_collection.json`

---

## Render Deployment
### 1) Backend
- Backend service uses `rootDir: backend`
- Environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `OPENROUTER_API_KEY`
  - `PORT`
  - `FRONTEND_ORIGIN`

### 2) Frontend
- Frontend is built and deployed as a static site

### render.yaml
See root `render.yaml`.

---

## Notes
- Protected routes in frontend require JWT stored in `localStorage`.
- `GET /api/seed` exists for seeding sample employees (public for demo).

