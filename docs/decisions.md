# Technical Decision Records

## TDR-1: Frontend Framework — React + Vite

**Decision**: Use React 18 with Vite as the build tool.

**Context**: Needed a modern, fast frontend framework for a single-page application with interactive UI (Kanban board, modals, drag-and-drop).

**Alternatives Considered**:
- **Next.js**: SSR/SSG capabilities unnecessary for this SPA; adds complexity without benefit
- **Vanilla HTML/JS**: Insufficient for the level of interactivity required (state management, component composition)
- **Vue/Angular**: React was preferred for its ecosystem maturity and the team's familiarity

**Rationale**: React + Vite provides the fastest development experience (HMR, instant builds), excellent component model for the task board UI, and a massive ecosystem for future extensibility.

---

## TDR-2: Backend — Express.js

**Decision**: Use Express.js (Node.js) as the backend API server.

**Context**: Need a REST API to handle task CRUD operations, authentication verification, and AI service integration.

**Alternatives Considered**:
- **Next.js API Routes**: Would tightly couple frontend and backend; less control over middleware
- **Firebase Cloud Functions**: Good serverless option but adds cold start latency and limits control

**Rationale**: Express.js is lightweight, well-understood, highly flexible with middleware (CORS, rate-limiting, auth), and can be deployed anywhere (Railway, Render, etc.).

---

## TDR-3: Authentication — Firebase Auth (Google Sign-In)

**Decision**: Use Firebase Authentication with Google Sign-In as the only auth method.

**Context**: Need secure user authentication with minimal setup for a time-boxed assessment.

**Alternatives Considered**:
- **Passport.js + Google OAuth2**: More configuration, session management, callback URLs
- **NextAuth.js**: Requires Next.js framework
- **Custom JWT**: Too much implementation effort for no additional benefit

**Rationale**: Firebase Auth provides plug-and-play Google Sign-In, automatic token management, secure ID token verification via Firebase Admin SDK, and seamless integration with Firestore security rules.

---

## TDR-4: Database — Cloud Firestore

**Decision**: Use Cloud Firestore as the primary database.

**Context**: Need a database to store tasks with user-scoped access control.

**Alternatives Considered**:
- **MongoDB Atlas**: Requires separate account setup, connection string management
- **SQLite**: File-based, not suitable for cloud deployment
- **PostgreSQL (Supabase/Neon)**: Relational overhead unnecessary for simple task documents

**Rationale**: Firestore pairs naturally with Firebase Auth (same project, same SDK), offers real-time capabilities, scales automatically, and requires no schema migrations. The document model maps perfectly to task data.

---

## TDR-5: AI Assistant — Google Gemini API

**Decision**: Use Google Gemini (gemini-2.0-flash) for AI-powered task improvement suggestions.

**Context**: Need an AI service to analyze tasks and provide actionable improvement suggestions.

**Alternatives Considered**:
- **OpenAI GPT**: Requires separate API key and billing; less integration with Google ecosystem
- **Mock responses**: No real AI value; wouldn't demonstrate actual AI integration

**Rationale**: Gemini API offers a generous free tier, fast inference (flash model), structured JSON output capability, and stays within the Google ecosystem. The `@google/generative-ai` SDK is lightweight and well-documented.

---

## TDR-6: Styling — Vanilla CSS with Custom Properties

**Decision**: Use vanilla CSS with CSS custom properties (design tokens) instead of a CSS framework.

**Context**: Need a premium, highly customized dark UI with glassmorphism effects.

**Alternatives Considered**:
- **Tailwind CSS**: Utility-first approach would clutter JSX; harder to achieve bespoke glassmorphism effects
- **Styled Components**: Runtime CSS-in-JS adds bundle size; unnecessary for this project scale
- **Material UI**: Pre-built components would limit design customization

**Rationale**: Vanilla CSS with a design token system provides maximum control over the visual design, zero runtime overhead, and a clean separation between structure (JSX) and presentation (CSS). The design system uses ~60 CSS custom properties for consistent theming.

---

## TDR-7: Deployment — Railway

**Decision**: Deploy to Railway for both backend and frontend hosting.

**Context**: Need a simple, free deployment platform that supports Node.js applications.

**Alternatives Considered**:
- **Vercel**: Excellent for frontend but requires separate backend hosting
- **Render**: Similar to Railway but slightly more complex setup
- **Firebase Hosting + Cloud Functions**: Would lock into Firebase for compute

**Rationale**: Railway supports full-stack Node.js deployments, has a simple free tier, automatic builds from GitHub, environment variable management, and custom domain support. A single platform for the entire stack simplifies operations.
