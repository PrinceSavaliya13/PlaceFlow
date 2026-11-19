# myRepo
# PlaceFlow — College Placement Management System

## Installation

1. Copy `server/.env.example` to `server/.env` and configure MongoDB.
2. Run `npm run install:all`.
3. Run `npm run seed` for demo data.
4. Run `npm run dev`.

The frontend is served on port 5173 and the REST API on port 5000.

## Demo accounts

| Role    | Email              | Password    |
| ------- | ------------------ | ----------- |
| Admin   | admin@campus.edu   | Admin@123   |
| Company | hr@acme.com        | Company@123 |
| Student | student@campus.edu | Student@123 |

## API

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs`, `GET /api/jobs/:id`, and company job CRUD at `/api/jobs`
- Student resources: `/api/students`, `/api/applications`
- Company resources: `/api/companies`
- Administration: `/api/admin`
- Notifications: `/api/notifications`

All protected endpoints use a Bearer JWT or the HTTP-only authentication cookie.
