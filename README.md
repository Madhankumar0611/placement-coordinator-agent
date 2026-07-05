# AI Placement Coordinator Agent — Drivehouse

An AI-powered web app that helps a college placement cell manage students,
company drives, eligibility, resumes, interview prep, and student queries —
powered by an LLM (Groq API — fast inference on open models like Llama 3.3).

## Tech stack

| Layer     | Technology                                   |
|-----------|-----------------------------------------------|
| Frontend  | React, React Router, Recharts, Axios          |
| Backend   | Node.js + Express                             |
| Database  | MongoDB Atlas (Mongoose)                      |
| AI        | Groq API (Llama 3.3 70B by default) — see `services/groqService.js` |
| Auth      | JWT + bcrypt                                  |
| Deploy    | Docker + docker-compose                       |

## Project structure

```
placement-coordinator-agent/
├── backend/            Node/Express API
│   ├── config/         DB connection
│   ├── controllers/    Route handlers (students, companies, placements, AI, auth)
│   ├── middleware/      JWT auth guard
│   ├── models/          Mongoose schemas
│   ├── routes/          Express routers
│   ├── services/        Groq API wrapper
│   └── server.js
├── frontend/            React app ("Drivehouse")
│   └── src/
│       ├── components/  Sidebar, Topbar, StatCard, ReadinessRing, Layout
│       ├── pages/       Landing, Login, Dashboard, Students, Companies,
│       │                EligibilityChecker, ResumeReviewer, InterviewQuestions,
│       │                EmailGenerator, Chatbot
│       ├── services/    Axios API client
│       └── styles/      theme.css (design tokens + global styles)
├── docker/               Dockerfile.backend, Dockerfile.frontend
├── docker-compose.yml
└── README.md
```

## 1. Local setup (no Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env       # fill in MONGO_URI, JWT_SECRET, GROQ_API_KEY
npm run dev                # nodemon, http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # REACT_APP_API_URL=http://localhost:5000/api
npm start                  # http://localhost:3000
```

The app works even without the backend running (pages fall back to demo
data), but the AI tools (eligibility checker, resume reviewer, interview
questions, email generator, chatbot) need the backend + a valid
`GROQ_API_KEY` to return real answers.

## 2. Getting a Groq API key

1. Go to https://console.groq.com/keys
2. Create an API key and paste it into `backend/.env` as `GROQ_API_KEY`.
3. The default model is `llama-3.3-70b-versatile`. You can change it via the
   `GROQ_MODEL` env var — see https://console.groq.com/docs/models for the
   current list of available models.
4. (Optional) To switch back to Google Gemini, create a `services/geminiService.js`
   calling `https://generativelanguage.googleapis.com/v1beta/models/<model>:generateContent`
   and swap the import in `controllers/aiController.js`.

## 3. Running with Docker

```bash
# from the project root
cp backend/.env.example .env   # fill in real values
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

## 4. API overview

| Method | Route                              | Purpose                        |
|--------|-------------------------------------|---------------------------------|
| POST   | `/api/auth/register` / `/login`     | User auth                      |
| GET/POST/PUT/DELETE | `/api/students`         | Student CRUD                   |
| POST   | `/api/students/:id/resume`          | Resume upload (multipart)      |
| GET/POST/PUT/DELETE | `/api/companies`        | Company/drive CRUD              |
| GET/POST/PUT | `/api/placements`             | Placement records               |
| GET    | `/api/placements/stats/summary`     | Dashboard stats                 |
| POST   | `/api/ai/eligibility`               | AI eligibility check (by IDs)   |
| POST   | `/api/ai/resume-review`             | AI resume review                |
| POST   | `/api/ai/interview-questions`       | AI interview question generator |
| POST   | `/api/ai/generate-email`            | AI email generator              |
| POST   | `/api/ai/chat`                      | Student chatbot                 |
| GET    | `/api/ai/chat/history`              | Chat history                    |

## 5. Authentication & roles

The app now enforces real login and role-based access:

- **All frontend pages except Landing, Login, and Register require a logged-in
  session.** Visiting any other page without a valid token redirects to
  `/login` (see `src/components/ProtectedRoute.js`).
- **Two roles:** `student` and `coordinator` (an `admin` role also exists and
  is treated the same as `coordinator`). Pick one when registering on
  `/register`.
- **Coordinator-only actions**, enforced on both frontend and backend:
  - Adding, editing, or deleting students
  - Adding, editing, or deleting company drives
  - Recording/updating placement outcomes
  - The AI Email Generator tool
  - The "Students" and "Company Drives" links only show in the sidebar for
    coordinators; students who navigate to those URLs directly see a
    read-only view (or a blocked message for Email Generator).
- **Available to any logged-in user (student or coordinator):**
  Dashboard, Eligibility Checker, Resume Reviewer, Interview Question
  Generator, and the Chatbot.
- Backend enforcement lives in `backend/middleware/authMiddleware.js`
  (`protect` requires a valid JWT; `requireRole('coordinator', 'admin')`
  additionally checks the role) and is applied per-route in
  `backend/routes/*.js`. Even if someone bypasses the UI, the API itself
  rejects unauthorized requests with 401/403.

**Note:** `/api/auth/register` currently lets anyone self-select the
`coordinator` role for demo convenience. For a production deployment, you'd
want to remove that option from the public registration form and instead
have an existing coordinator/admin promote accounts.

## 6. Design notes

The frontend ("Drivehouse") uses a small custom design system
(`src/styles/theme.css`) built around the idea of a placement cell running a
sequence of company drives:

- **Drive Rail** — a vertical timeline of upcoming/completed drives on the
  dashboard.
- **Readiness Ring** — a radial indicator on the Students page showing an
  at-a-glance eligibility/readiness score per student.
- **Palette** — deep navy sidebar (`#0E1330`), indigo-violet primary accent
  (`#5B5FEF`), teal for "placed" (`#17B8A6`), amber for "pending", coral for
  "not eligible/rejected".
- **Type** — Sora for headings, Inter for body copy, IBM Plex Mono for
  numeric/statistical figures.

## 7. Extending

- Swap Groq → another provider (OpenAI, Gemini, Claude) in `backend/services/groqService.js` — just change the endpoint, headers, and response-parsing shape.
- Add JWT-protected routes by wrapping routers with the `protect` /
  `requireRole` middleware in `backend/middleware/authMiddleware.js`.
- Add PDF resume parsing with the already-included `pdf-parse` dependency.
- Export dashboard stats to PDF/Excel using `pdf` or `xlsx` libraries.
