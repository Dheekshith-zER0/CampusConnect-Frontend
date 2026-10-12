# CampusConnect – Frontend

React interface for **CampusConnect**, a campus issue and complaint management system. Students report problems on campus and track them until they are resolved; administrators manage every complaint from a dashboard.

**Stack:** React 19 · Vite · JavaScript · HTML/CSS · Axios · React Router · deployed on Vercel

Backend repository: `CampusConnect-Backend` (Spring Boot + MySQL, deployed on Render).

---

## Features

**Students**
- Register (name, roll number, department, email, password) and log in
- Submit a complaint: pick a category, then add a title, location and description
- View all of your complaints with counts per status and status filters
- Open a complaint to see a progress tracker (Submitted → In Progress → Resolved), the full status history and admin remarks
- Edit or withdraw a complaint while it is still *Submitted*

**Administrators**
- Dashboard with totals per status (click a card to filter)
- Search by title, location, student name or email; filter by status and category
- Complaint details with student information
- Update status with remarks (a reason is required for *Rejected*), or delete a complaint

**General**
- Responsive layout (the admin table turns into cards on phones) with automatic light/dark theme
- Loading states, inline validation, readable server error messages and "try again" actions
- A "server is waking up" hint when the free Render backend is cold-starting
- Expired or invalid sessions are logged out automatically

---

## Project structure

```
src/
├── api/
│   ├── client.js          Axios instance: base URL from VITE_API_BASE_URL, token header, 401 handling
│   └── services.js        authApi, complaintApi, adminApi
├── components/            Navbar, RouteGuards, ComplaintForm, StatusUpdateForm, StatusBadge,
│                          StatusStepper, StatusTimeline, StatCards, ComplaintCard, Loader, Alert, FormField
├── context/               AuthProvider (logged-in user, login/register/logout)
├── hooks/                 useAuth, useApi (loading/error state), useDebouncedValue
├── pages/
│   ├── Home.jsx, Login.jsx, Register.jsx, ComplaintDetails.jsx, NotFound.jsx
│   ├── student/           StudentDashboard, NewComplaint, EditComplaint
│   └── admin/             AdminDashboard
├── utils/                 constants (categories, statuses), formatting, localStorage helpers
├── App.jsx                Routes
└── index.css              All styles
```

### Routes

| Path | Who | Page |
|---|---|---|
| `/` | Everyone | Landing page |
| `/login`, `/register` | Guests | Authentication |
| `/student` | Students | My complaints |
| `/student/new` | Students | Submit a complaint |
| `/student/complaints/:id/edit` | Students | Edit a complaint |
| `/complaints/:id` | Owner / Admin | Complaint details and tracking |
| `/admin` | Admins | Complaint management dashboard |

---

## Environment variable

| Variable | Example | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://campusconnect-backend.onrender.com` | Backend URL, without a trailing slash and without `/api` |

If it isn't set, the app uses `http://localhost:8080`. Vite reads this variable **at build time**, so after changing it on Vercel you must redeploy.

---

## Run locally

Prerequisites: Node.js 20.19+ (or 22+), and the backend running on port 8080.

```bash
npm install
cp .env.example .env        # optional, the default already points at localhost:8080
npm run dev
```

Open http://localhost:5173.

Other scripts: `npm run build` (production build into `dist/`), `npm run preview` (serve the build), `npm run lint`.

---

## Deploy to Vercel

1. In Vercel, go to **Add New → Project** and import this GitHub repo. The framework preset **Vite** is detected automatically (build command `npm run build`, output directory `dist`).
2. Under **Environment Variables**, add `VITE_API_BASE_URL` = your Render backend URL, e.g. `https://campusconnect-backend.onrender.com`.
3. Click **Deploy**.
4. Copy the production URL (e.g. `https://campusconnect.vercel.app`) and add it to the backend's `CORS_ALLOWED_ORIGINS` on Render.

`vercel.json` rewrites every path to `index.html`, so refreshing or opening a deep link such as `/complaints/12` works.

### Troubleshooting

| Symptom | Fix |
|---|---|
| "Cannot reach the server" plus a CORS error in the browser console | The Vercel URL is missing from `CORS_ALLOWED_ORIGINS` on Render, or it has a trailing slash |
| Requests go to `localhost:8080` in production | `VITE_API_BASE_URL` was not set before the build. Set it and redeploy. |
| First request is very slow | The Render free instance is waking up. Wait up to a minute. |
| 404 when refreshing a page | Make sure `vercel.json` is committed |
