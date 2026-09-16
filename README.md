# TaskFlow — Smart Task Management

A modern, full-stack task management application with Google authentication, Kanban board, and AI-powered task improvement suggestions.

## ✨ Features

- **🔒 Google Sign-In** — Secure authentication via Firebase
- **📋 Kanban Board** — Visual task board with To Do / In Progress / Done columns
- **🖱 Drag & Drop** — Move tasks between columns instantly
- **📝 Full CRUD** — Create, read, update, and delete tasks
- **🎯 Priority Levels** — Assign High / Medium / Low priority
- **🔍 Search & Filter** — Find tasks by text or filter by priority
- **🤖 AI Task Assistant** — Get Gemini AI suggestions to improve task descriptions
- **📱 Responsive** — Works on desktop, tablet, and mobile
- **🎨 Dark Theme** — Premium glassmorphism UI design

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Express.js (Node.js) |
| Authentication | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore |
| AI Assistant | Google Gemini API (gemini-2.0-flash) |
| Deployment | Railway |

## 📁 Project Structure

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
│   │   └── services/          # API client
│   └── vite.config.js
├── backend/                   # Express.js REST API
│   └── src/
│       ├── config/            # Firebase Admin SDK init
│       ├── middleware/        # Auth middleware
│       ├── routes/            # Task & AI routes
│       ├── services/          # Task & AI business logic
│       ├── utils/             # Input validators
│       └── __tests__/         # Jest unit tests
├── docs/                      # Project documentation
│   ├── requirements.md        # Functional & non-functional requirements
│   ├── assumptions.md         # Technical & design assumptions
│   ├── decisions.md           # Technical decision records (ADRs)
│   ├── usability.md           # UX & accessibility notes
│   └── ai-usage.md            # AI usage in product & development
├── .env.example               # Environment variable template
├── .gitignore
├── package.json               # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** ([nodejs.org](https://nodejs.org))
- **Firebase Project** with Firestore + Google Auth enabled
- **Google Gemini API Key** ([aistudio.google.com](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/dharshanworks/task-management-app.git
cd task-management-app
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment

```bash
# Backend environment
cp .env.example backend/.env
# Edit backend/.env with your Firebase + Gemini credentials

# Frontend environment (create frontend/.env)
# Add your Firebase client config:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_FIREBASE_STORAGE_BUCKET=...
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts both:
- **Frontend** at http://localhost:5173
- **Backend** at http://localhost:5000

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | List user's tasks (with filters) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | Get a single task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/ai/improve-task` | Get AI suggestions for a task |

All `/api/tasks` and `/api/ai` endpoints require a valid Firebase ID token in the `Authorization: Bearer <token>` header.

## 🧪 Testing

```bash
# Run backend unit tests
cd backend && npm test
```

## 🔐 Security

- Firebase ID token verification on all protected endpoints
- Helmet.js for HTTP security headers
- CORS restricted to frontend origin
- Rate limiting (200 req/15min general, 10 req/min AI)
- Request body size limit (10KB)
- User-scoped data access (ownership checks on all CRUD operations)
- No secrets in version control

## 📄 Documentation

| Document | Description |
|---|---|
| [Requirements](docs/requirements.md) | Functional & non-functional requirements |
| [Assumptions](docs/assumptions.md) | Technical & design assumptions |
| [Decisions](docs/decisions.md) | Technical decision records (ADRs) |
| [Usability](docs/usability.md) | UX, accessibility & responsive design |
| [AI Usage](docs/ai-usage.md) | AI in the product & development process |

## 📜 License

MIT
