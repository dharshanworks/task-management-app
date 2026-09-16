# Task Management Application

A modern, full-stack task management application with Google authentication, real-time task tracking, and AI-powered task improvement suggestions.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Express.js (Node.js) |
| Authentication | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore |
| AI Assistant | Google Gemini API |
| Deployment | Railway |

## Features

- **Google Sign-In** — Secure authentication via Firebase
- **Task Management** — Create, edit, delete, and organize tasks
- **Kanban Board** — Visual task board with Todo / In Progress / Done columns
- **Priority & Filtering** — Assign priority levels, filter, and search tasks
- **AI Task Assistant** — Get AI-powered suggestions to improve task descriptions
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile

## Project Structure

```
task-management-app/
├── frontend/          # React + Vite SPA
├── backend/           # Express.js REST API
├── docs/              # Project documentation
│   ├── requirements.md
│   ├── assumptions.md
│   ├── decisions.md
│   ├── usability.md
│   └── ai-usage.md
├── .env.example       # Environment variable template
├── .gitignore
├── package.json       # Root workspace config
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase project with Firestore and Google Auth enabled
- Google Gemini API key

### Setup

```bash
# Clone the repository
git clone https://github.com/dharshanworks/task-management-app.git
cd task-management-app

# Install dependencies
npm install

# Configure environment variables
cp .env.example backend/.env
# Edit backend/.env with your Firebase + Gemini credentials

# Start development servers
npm run dev
```

## License

MIT
