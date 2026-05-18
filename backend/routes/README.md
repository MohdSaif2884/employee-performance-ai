# Backend Routes

- POST `/api/auth/signup`
- POST `/api/auth/login`

Protected (JWT required):
- POST `/api/employees`
- GET `/api/employees`
- GET `/api/employees/:id`
- PUT `/api/employees/:id`
- DELETE `/api/employees/:id`
- GET `/api/employees/search?department=Development`

Protected (JWT required):
- POST `/api/ai/recommend`

