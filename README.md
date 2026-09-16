# TaskFlow — Smart Task Management Application

> **Graduate Support Engineer Trainee Assessment**
> A task management application built using AI-assisted development tools.

🌐 **Live Application**: [https://task-management-app-production-b7ee.up.railway.app](https://task-management-app-production-b7ee.up.railway.app)
📦 **Source Code**: [https://github.com/dharshanworks/task-management-app](https://github.com/dharshanworks/task-management-app)

---

## Table of Contents

1. [How to Access and Use the Application](#1-how-to-access-and-use-the-application)
2. [Login Instructions](#2-login-instructions)
3. [Assumptions Made](#3-assumptions-made)
4. [Known Limitations](#4-known-limitations)
5. [Important Notes & Warnings](#5-important-notes--warnings)
6. [Setup Instructions (Local Development)](#6-setup-instructions-local-development)
7. [AI Usage Summary](#7-ai-usage-summary)
8. [Tech Stack](#8-tech-stack)
9. [API Endpoints](#9-api-endpoints)
10. [Project Structure](#10-project-structure)

---

## 1. How to Access and Use the Application

### Quick Start (No Setup Required)

1. Open the live app: [https://task-management-app-production-b7ee.up.railway.app](https://task-management-app-production-b7ee.up.railway.app)
2. Click **"Sign in with Google"**
3. You'll land on the **Kanban board** — your task workspace

### How to Perform Each Action

| Action | How To |
|---|---|
| **Create a task** | Click **"+ New Task"** → fill in title, description, priority, status, due date → click **"Create Task"** |
| **View tasks** | All tasks are displayed on the Kanban board in three columns: **To Do**, **In Progress**, **Done** |
| **Update task status** | **Drag & drop** a card between columns, or click the edit ✏️ button and change the status dropdown |
| **Edit a task** | Click the ✏️ button on any card to modify any field |
| **Delete a task** | Click the 🗑️ button on any card |
| **Search tasks** | Use the search bar to filter tasks by title or description |
| **Filter by priority** | Use the priority dropdown to show only High / Medium / Low tasks |
| **AI suggestions** | Click the ✨ button on a card → review the suggestion → click **"Apply"** or dismiss |
| **Sign out** | Click your avatar in the header → **"Sign Out"** |

---

## 2. Login Instructions

This application uses **Google Sign-In** exclusively.

### Steps

1. Open the application URL
2. Click the **"Sign in with Google"** button
3. Select your Google account (or enter your credentials)
4. Grant permission to view your basic profile
5. You'll be redirected to the task board automatically

### Notes

- **Google accounts only** — no email/password or other social logins
- Your session **persists across refreshes** — no need to sign in again unless you sign out
- The app only reads your **name, email, and profile picture** — no other Google data
- All tasks are **private** to your account

---

## 3. Assumptions Made

### Technical

- **Node.js 18+** is available for local development
- **Firebase project** is pre-configured with Firestore and Google Sign-In enabled
- Users have a **modern browser** (Chrome, Firefox, Safari, Edge — latest 2 versions)
- **Gemini API key** is optional — the app works fully without it (generic fallback suggestions are shown)

### Design & UX

- **Single auth method** — Google Sign-In is sufficient per requirements; no password management needed
- **Tasks are private** — each user sees only their own tasks; no sharing or collaboration
- **Dark theme only** — a single polished theme to ensure premium feel and reduce scope
- **Desktop-first, responsive** — optimized for desktop but fully functional on mobile
- **AI suggestions are advisory** — the AI never auto-applies changes; the user always decides
- **"To Do / In Progress / Done"** labels used instead of "Planned / In Progress / Complete" — these are industry-standard (Jira, Trello, Asana) and more intuitive; functionally identical

### Data

- **No task history** — edits overwrite previous data (no undo/audit trail)
- **Client-side search** — filtering happens in-browser, sufficient for personal task volumes
- **No file attachments** — tasks are text-only
- **Internet required** — no offline mode

---

## 4. Known Limitations

| # | Limitation | Impact | Workaround |
|---|---|---|---|
| 1 | Google-only authentication | Users without Google accounts can't sign in | None — per requirements |
| 2 | No offline mode | Requires internet at all times | Ensure stable connection |
| 3 | No real-time sync across tabs | Multiple tabs may show stale data | Refresh the page |
| 4 | No pagination | All tasks load at once | May slow down with 500+ tasks |
| 5 | No manual task reordering | Tasks sorted by creation date within columns | Use drag-and-drop for status changes only |
| 6 | AI requires API key | AI suggestions won't work without Gemini key configured | App works fully without AI; fallback suggestions shown |
| 7 | Dark theme only | No light mode option | — |
| 8 | No data export | Can't export tasks to CSV/PDF | Copy details manually |
| 9 | Railway cold starts | First load may take 5–10s if server was idle | Wait for initial load; subsequent requests are fast |

---

## 5. Important Notes & Warnings

> ⚠️ **First Load Delay**: The app is on Railway's free tier. If the server was idle, the first page load may take **5–10 seconds** to cold-start. After that, everything is fast.

> ⚠️ **Google Account Required**: You must have a Google account to use this application.

> ⚠️ **Data Persistence**: Tasks are stored in Cloud Firestore. They persist across sessions and devices as long as you sign in with the same Google account.

> ⚠️ **Browser Compatibility**: Use a modern browser for the best experience. Drag-and-drop requires pointer event support (all major browsers support this).

> ⚠️ **AI Feature**: The AI assistant uses the Gemini API. Suggestions are AI-generated — always review before applying. The AI only sees the task title and description you submit.

---

## 6. Setup Instructions (Local Development)

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Firebase Project** — with Firestore and Google Sign-In enabled
- **Gemini API Key** (optional) — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Step 1: Clone

```bash
git clone https://github.com/dharshanworks/task-management-app.git
cd task-management-app
```

### Step 2: Install Dependencies

```bash
npm run install:all
```

### Step 3: Configure Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

> Place your Firebase service account JSON at `backend/serviceAccountKey.json` (download from Firebase Console → Project Settings → Service Accounts).

**Frontend** — create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxx
```

> Get these values from Firebase Console → Project Settings → General → Your Apps → Web App.

### Step 4: Start Development

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Step 5: Verify

1. Open http://localhost:5173
2. Sign in with Google
3. Create a task → verify it appears on the board
4. Drag it to another column → verify status updates

---

## 7. AI Usage Summary

### What AI Tools Were Used

| Tool | Purpose |
|---|---|
| **Google Gemini (Antigravity IDE)** | Primary AI pair-programming assistant throughout development |
| **Google Gemini API** | Integrated into the app as the AI Task Assistant feature |

### How AI Was Used

1. **Architecture & Planning** — Analyzed requirements, proposed tech stack (React + Express + Firebase + Gemini), designed API structure and component hierarchy
2. **Code Generation** — Generated boilerplate for Express server, React components, CSS design system, Firebase integration, and Gemini API prompt engineering
3. **Quality Assurance** — Generated unit tests, applied security best practices (Helmet, CORS, rate limiting), reviewed code for issues
4. **Documentation** — Generated project docs (requirements, assumptions, decisions, usability, AI usage)

### Example Prompts Given

- *"Create an Express.js backend with Firebase Auth middleware that verifies ID tokens"*
- *"Build a React Kanban board component with drag-and-drop using @dnd-kit"*
- *"Write a Gemini API integration that returns structured improvement suggestions as JSON"*
- *"Add rate limiting to the AI endpoint — 10 requests per minute per user"*
- *"Create a glassmorphism dark theme CSS design system with custom properties"*

### What Was Modified or Corrected Manually

| Area | AI Generated | Manual Correction |
|---|---|---|
| **Firebase COOP header** | Default Helmet config | Added explicit `unsafe-none` COOP override to fix Google Sign-In popup on Railway |
| **Auth flow** | Used `signInWithPopup` | Changed to `signInWithRedirect` — popups fail on mobile and deployed environments |
| **Firestore queries** | Compound queries with composite indexes | Switched to in-memory filtering — avoids requiring composite index setup |
| **AI response parsing** | Basic `JSON.parse()` | Added markdown code fence stripping — Gemini sometimes wraps JSON in `` ```json ``` `` blocks |
| **CORS config** | Simple origin string | Enhanced to support comma-separated origins + localhost pattern matching |
| **Error messages** | Generic error strings | Wrote user-friendly, context-specific messages for each Firebase auth error code |

---

## 8. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev experience, component model fits Kanban board |
| Drag & Drop | @dnd-kit | Accessible, keyboard-friendly |
| Styling | Vanilla CSS + Custom Properties | Full control, zero runtime cost |
| Backend | Express.js | Lightweight, flexible middleware |
| Auth | Firebase Authentication | Plug-and-play Google Sign-In + token verification |
| Database | Cloud Firestore | Schemaless, pairs with Firebase Auth |
| AI | Google Gemini API | Fast inference, generous free tier, structured output |
| Hosting | Railway | Full-stack Node.js hosting with auto-deploy |

---

## 9. API Endpoints

All `/api/tasks` and `/api/ai` endpoints require `Authorization: Bearer <firebase-id-token>`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check (no auth) |
| `GET` | `/api/tasks` | List user's tasks (`?status=`, `?priority=`, `?search=`) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | Get a single task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/ai/improve-task` | Get AI suggestions for a task |

---

## 10. Project Structure

```
task-management-app/
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/          # LoginPage
│   │   │   ├── Layout/        # AppLayout (header, nav)
│   │   │   ├── Tasks/         # TaskBoard, TaskCard, TaskForm, TaskFilters
│   │   │   ├── AI/            # AISuggestionPanel
│   │   │   └── Common/        # Toast notifications
│   │   ├── config/            # Firebase client config
│   │   ├── contexts/          # AuthContext (React Context)
│   │   └── services/          # API client (fetch wrapper)
│   └── vite.config.js
├── backend/                   # Express.js REST API
│   └── src/
│       ├── config/            # Firebase Admin SDK init
│       ├── middleware/        # Auth middleware
│       ├── routes/            # Task & AI route handlers
│       ├── services/          # Business logic (Firestore, Gemini)
│       ├── utils/             # Input validation
│       └── __tests__/         # Jest unit tests
├── docs/                      # Detailed documentation
│   ├── requirements.md
│   ├── assumptions.md
│   ├── decisions.md
│   ├── usability.md
│   ├── ai-usage.md
│   └── deployment.md
├── .env.example
└── README.md
```

---

## License

MIT
