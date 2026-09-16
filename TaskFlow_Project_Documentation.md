# TaskFlow — Smart Task Management Application
## Comprehensive Software Engineering & Technical Documentation

> **Live Production Application**: [https://task-management-app-production-b7ee.up.railway.app](https://task-management-app-production-b7ee.up.railway.app)  
> **Repository**: [https://github.com/dharshanworks/task-management-app](https://github.com/dharshanworks/task-management-app)  
> **Health Check Endpoint**: [https://task-management-app-production-b7ee.up.railway.app/api/health](https://task-management-app-production-b7ee.up.railway.app/api/health)  
> **Document Version**: 1.0.0 (Production Release)  
> **Generated Word Document (.docx)**: [`TaskFlow_Project_Documentation.docx`](TaskFlow_Project_Documentation.docx)

---

## 1. Executive Summary

**TaskFlow** is a modern, full-stack task management web application that combines frictionless visual organization with generative artificial intelligence. Built for individuals, teams, and high-velocity knowledge workers, TaskFlow provides an intuitive Kanban board interface where users manage tasks across `To Do`, `In Progress`, and `Done` lifecycles using interactive drag-and-drop operations, multi-criteria filtering, and instant text search.

### Core Value Proposition
- **Frictionless Google Authentication**: Instant sign-in via Firebase OAuth 2.0 with session persistence.
- **Interactive Kanban Board**: HTML5 drag-and-drop workflow with keyboard-accessible status updates.
- **AI Task Assistant**: Powered by Google Gemini (`gemini-3.6-flash` / `gemini-2.0-flash`) providing structured improvement suggestions, subtask breakdowns, duration estimates, and priority advice.
- **Enterprise-Grade Security**: Cryptographic Firebase ID token verification, strict server-side tenant isolation (IDOR prevention), HTTP header hardening via Helmet.js, origin-restricted CORS, and multi-tier rate limiting.
- **Cloud-Native Unified Deployment**: Single-service deployment on Railway with automated builds and health check monitoring.

---

## 2. System Architecture & Tech Stack

TaskFlow follows a decoupled client-server architecture deployed as a unified production container:

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Browser / SPA)                │
│   React 18 + Vite | Vanilla CSS Tokens (Dark Glassmorphism) │
│       AuthContext | TaskBoard | TaskCard | TaskForm         │
│                     AISuggestionPanel                       │
└───────────────┬─────────────────────────────▲───────────────┘
                │ HTTPS (JSON + Bearer Token) │
                ▼                             │
┌─────────────────────────────────────────────┴───────────────┐
│                 Application Layer (REST API)                │
│                 Express.js (Node.js 18+)                    │
│   Security: Helmet | CORS | RateLimiter (200/15m & 10/1m)   │
│   Auth Middleware: Firebase Admin SDK verifyIdToken()       │
│   Routes: /api/tasks/* | /api/ai/* | /api/health            │
└───────┬─────────────────────────────────────────────┬───────┘
        │ Admin SDK                                   │ REST / SDK
        ▼                                             ▼
┌───────────────────────────────┐   ┌─────────────────────────┐
│       Database Layer          │   │      AI Engine          │
│       Cloud Firestore         │   │   Google Gemini API     │
│   Collection: 'tasks'         │   │   (gemini-3.6-flash)    │
│   Single-Tenant Partitioning  │   │   Structured JSON Mode  │
└───────────────────────────────┘   └─────────────────────────┘
```

### Technology Matrix

| Layer | Component | Version | Role & Description |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | Single-Page Application (SPA) with declarative UI components |
| **Build Tool** | Vite | 6.0.0 | High-speed frontend bundler with Hot Module Replacement (HMR) |
| **Styling** | Vanilla CSS | CSS3 | Custom design system using 60+ CSS variables, glassmorphism, and hardware-accelerated transitions |
| **Backend** | Express.js | 4.21.1 | Node.js REST API handling endpoints, middleware, and static serving |
| **Authentication** | Firebase Auth | 12.19.0 (Client) / 13.0.2 (Admin) | Google OAuth 2.0 with cryptographic JWT ID token verification |
| **Database** | Cloud Firestore | Managed NoSQL | Document-based task database with millisecond query latencies |
| **AI Assistant** | Google Gemini API | `@google/generative-ai` 0.21.0 | Generative AI model (`gemini-3.6-flash`) for task analysis |
| **Security** | Helmet + RateLimit | 8.0.0 / 7.4.1 | HTTP security headers and IP rate limiting (200 req/15min general; 10 req/min AI) |
| **Hosting** | Railway | Nixpacks | Unified cloud container deployment with CI/CD from GitHub |

---

## 3. Requirements Specification

### 3.1 Functional Requirements (FR)

- **FR-1: User Authentication**:
  - Sign in using Google accounts via Firebase Authentication (Popup & Redirect fallback).
  - Secure session persistence across page refreshes.
  - User sign-out with cache clearing.
  - All protected API routes require valid Bearer ID tokens.
- **FR-2: Task CRUD Operations**:
  - **Create**: Add new tasks with title (required), description, status, priority, and due date.
  - **Read**: Fetch and display user-scoped tasks organized in Kanban columns.
  - **Update**: Edit any task field or move across columns via drag-and-drop.
  - **Delete**: Permanently delete tasks owned by the authenticated user.
- **FR-3: Task Organization & Search**:
  - Three fixed lifecycle columns: `To Do`, `In Progress`, and `Done`.
  - Multi-criteria filtering by priority level (`low`, `medium`, `high`).
  - Real-time client-side search across task title and description.
- **FR-4: Input Validation & Sanitization**:
  - Mandatory titles, trimmed, between 1 and 200 characters.
  - Optional descriptions, maximum 2000 characters.
  - Strict enum validation for status and priority.
  - ISO 8601 date format validation.
- **FR-5: AI Task Assistant**:
  - On-demand task refinement via Google Gemini API.
  - Provides improved title, outcome-oriented description, 3 actionable coaching tips, subtask breakdown, duration estimate, and suggested priority.
  - Advisory model: suggestions are never auto-applied without user approval.
  - Resilient fallback if the AI API is unreachable or rate-limited.
- **FR-6: Tenant Isolation & Data Ownership**:
  - Strict server-side verification: `task.userId === req.user.uid`.
  - Zero cross-user data leakage.

### 3.2 Non-Functional Requirements (NFR)

- **NFR-1: Performance**:
  - Frontend production bundle under 100KB gzipped (excluding vendor Firebase SDK).
  - Sub-500ms API response latency for CRUD operations.
- **NFR-2: Security**:
  - End-to-end HTTPS.
  - Cryptographic token verification.
  - Helmet.js protection against common web vulnerabilities.
  - Origin-restricted CORS.
  - Rate limiting (200 requests/15 min general, 10 requests/min AI).
  - 10KB request body limits to prevent payload exhaustion.
- **NFR-3: Usability & Accessibility**:
  - Dark-mode glassmorphism interface adhering to WCAG AA color contrast standards.
  - Responsive breakpoints: Mobile (`<768px`), Tablet (`<1024px`), Desktop (`>1024px`).
  - Keyboard accessibility: Escape to close modals, Tab order navigation.
  - ARIA live regions for toast notifications.
- **NFR-4: Reliability**:
  - Global error handling middleware.
  - Health check endpoint (`/api/health`) for PaaS uptime monitoring.

---

## 4. Database Schema & Data Architecture

Tasks are stored in Google Cloud Firestore in a root-level collection named `tasks`.

### `tasks` Collection Document Specification

| Field Name | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `id` | String | Yes (Auto) | Unique Document ID | Firestore auto-generated key |
| `title` | String | Yes | 1 – 200 characters | Clear, concise summary of the task |
| `description`| String | No | Max 2000 characters | Detailed specifications, context, or notes |
| `status` | String | Yes | `'todo' \| 'in-progress' \| 'done'` | Lifecycle stage column |
| `priority` | String | Yes | `'low' \| 'medium' \| 'high'` | Urgency rating (default: `'medium'`) |
| `dueDate` | String / Null | No | ISO 8601 date string | Completion deadline timestamp |
| `userId` | String | Yes | Foreign Key | Firebase Auth UID of task owner |
| `createdAt` | String | Yes | ISO 8601 date string | Document creation timestamp |
| `updatedAt` | String | Yes | ISO 8601 date string | Most recent update timestamp |

### Query Design Strategy
Queries are executed against Firestore using `where("userId", "==", userId)`. Filtering by status, priority, and text search, along with sorting by `createdAt` descending, is executed in Node.js memory. This eliminates the need for composite indexes in Firestore, simplifying deployment and avoiding database index limits.

---

## 5. RESTful API Specification

Base URL (Development): `http://localhost:5000/api`  
Base URL (Production): `https://task-management-app-production-b7ee.up.railway.app/api`

### Endpoint Catalog

| Method | Endpoint | Auth | Description | Status Codes |
|---|---|---|---|---|
| `GET` | `/health` | Public | System status, timestamp, environment | `200` |
| `GET` | `/tasks` | Bearer Token | List all user tasks (supports `status`, `priority`, `search`) | `200, 401, 500` |
| `POST` | `/tasks` | Bearer Token | Create a new task | `201, 400, 401, 500` |
| `GET` | `/tasks/:id` | Bearer Token | Retrieve a single task by ID | `200, 401, 403, 404, 500` |
| `PUT` | `/tasks/:id` | Bearer Token | Update an existing task | `200, 400, 401, 403, 404, 500` |
| `DELETE`| `/tasks/:id` | Bearer Token | Delete a task | `200, 401, 403, 404, 500` |
| `POST` | `/ai/improve-task` | Bearer Token | Generate Gemini AI improvement suggestions | `200, 400, 401, 429, 503` |

### Sample AI Request & Response Payload

**Request** (`POST /api/ai/improve-task`):
```json
{
  "title": "Fix bug in login",
  "description": "Users report login fails sometimes"
}
```

**Response** (`200 OK`):
```json
{
  "suggestions": {
    "improvedTitle": "Resolve intermittent authentication failures during Google OAuth sign-in",
    "improvedDescription": "Investigate and resolve intermittent Google OAuth login failures. Audit popup blocker handling, domain authorization, and network timeout exceptions.",
    "suggestions": [
      "Add retry logic with exponential backoff for transient network issues",
      "Provide an explicit redirect fallback option if popups are blocked",
      "Add user-friendly error messages explaining domain authorization steps"
    ],
    "estimatedTime": "2 hours",
    "suggestedPriority": "high",
    "subtasks": [
      "Verify authorized domains in Firebase Console",
      "Add loading states to prevent double-clicks",
      "Test redirect sign-in flow on deployed domain"
    ]
  }
}
```

---

## 6. AI Integration & Prompt Engineering

### Architecture & Capabilities
The AI Assistant uses `@google/generative-ai` with the `gemini-3.6-flash` model. It delivers six distinct intelligence dimensions:
1. **Title Refinement**: Turns vague statements into specific, action-oriented titles.
2. **Outcome-Oriented Descriptions**: Enriches sparse descriptions with tangible deliverables and acceptance criteria.
3. **Actionable Coaching**: Delivers 3 concrete recommendations for execution.
4. **Subtask Decomposition**: Splits monolithic tasks into sequential, achievable subtasks.
5. **Duration Estimation**: Estimates completion time for scheduling.
6. **Priority Recommendation**: Suggests low, medium, or high priority based on business impact.

### Advisory Model
The AI features strictly respect human agency. Suggested improvements are displayed in an inspection panel. Users review the proposed changes side-by-side with original content, choose whether to accept individual subtasks, and click **Apply Improvements** to commit updates.

---

## 7. Security, Authentication & Privacy

1. **Cryptographic Identity Verification**: Every protected request requires an `Authorization: Bearer <ID_TOKEN>` header. The Firebase Admin SDK validates token expiration, signature integrity, and audience claims.
2. **Server-Side Authorization (Anti-IDOR)**: The backend guarantees that users cannot read, mutate, or delete tasks belonging to others. Ownership verification is executed in `getTaskById()` before updating or deleting documents.
3. **HTTP Header Hardening**: Helmet.js configures secure HTTP response headers.
4. **Origin-Restricted CORS**: Cross-origin access is strictly restricted to authorized frontend origins.
5. **Rate Limiting**:
   - General API: 200 requests / 15 minutes per IP.
   - AI Assistant: 10 requests / 1 minute per IP.
6. **Payload Throttling**: JSON body parsing is restricted to a maximum of 10KB.

---

## 8. Deployment & DevOps Guide

TaskFlow is hosted on [Railway](https://railway.app) as a unified full-stack service.

### Step-by-Step Railway Configuration
1. **Repository Link**: Connect GitHub repository `dharshanworks/task-management-app`.
2. **Build Configuration (`railway.json`)**:
   - Builder: `NIXPACKS`
   - Build Command: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - Start Command: `cd backend && npm start`
3. **Environment Variables**:
   ```env
   NODE_ENV=production
   FIREBASE_PROJECT_ID=task-management-app-001-3f330
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account", ...}
   GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
   VITE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
   VITE_FIREBASE_AUTH_DOMAIN=task-management-app-001-3f330.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=task-management-app-001-3f330
   VITE_FIREBASE_STORAGE_BUCKET=task-management-app-001-3f330.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=880620557199
   VITE_FIREBASE_APP_ID=1:880620557199:web:26f89a56cb82d90e9371fa
   ```

### Authorizing Railway Domain in Firebase Console (Crucial Step)
Google Authentication blocks popup sign-in requests from unauthorized domains. To resolve `auth/popup-closed-by-user` or `auth/unauthorized-domain`:
1. Open [Firebase Console](https://console.firebase.google.com).
2. Select project: `task-management-app-001`.
3. Go to **Authentication** → **Settings** tab → **Authorized domains**.
4. Click **Add domain**.
5. Enter: `task-management-app-production-b7ee.up.railway.app` (without `https://`).
6. Click **Save**. Google Sign-In takes effect immediately.

---

## 9. Architectural Decision Records (ADRs)

| ADR ID | Decision | Chosen Option | Key Rationale |
|---|---|---|---|
| **TDR-1** | Frontend Framework | React 18 + Vite | Instant HMR, minimal bundle size, robust component model |
| **TDR-2** | Backend Framework | Express.js (Node.js) | Lightweight REST architecture, middleware flexibility, portable deployment |
| **TDR-3** | Authentication | Firebase Auth | Turnkey Google OAuth, automated token lifecycle, robust Admin SDK |
| **TDR-4** | Database | Cloud Firestore | Scalable NoSQL document store, zero schema migration overhead |
| **TDR-5** | AI Model | Google Gemini Flash | Ultra-low latency, generous quota, native structured JSON output |
| **TDR-6** | Styling Engine | Vanilla CSS Tokens | Zero runtime cost, bespoke glassmorphism aesthetics, 60+ CSS custom properties |
| **TDR-7** | Deployment PaaS | Railway | Unified deployment serving Vite static build and Express API on a single domain |

---

## 10. Verification & Quality Assurance

- **Unit Testing**: Automated Jest test suites verifying:
  - `validators.test.js`: Title length, empty strings, status/priority enums, date format validation.
  - `taskService.test.js`: Task creation, query filtering, ownership verification, access denial.
- **Manual Verification Matrix**:
  - Google Sign-In flow (Popup & Redirect fallback).
  - Kanban board drag-and-drop operations across all columns.
  - Real-time text search and priority filtering.
  - AI Task Assistant suggestion generation and one-click application.
  - Mobile, tablet, and desktop responsive layouts.
