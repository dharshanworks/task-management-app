# Assumptions

## Technical Assumptions

1. **Node.js 18+** is available in the development and deployment environments
2. **Firebase project** has been provisioned with:
   - Firestore database created (production mode or test mode)
   - Google Sign-In provider enabled under Authentication → Sign-in method
   - A service account key generated for backend use
3. **Google Gemini API key** is available and has sufficient quota for AI features
4. **Railway** is used for deployment with sufficient free-tier resources

## User & Usage Assumptions

1. Users authenticate exclusively via Google accounts — no email/password or other OAuth providers
2. Tasks are private per user — no sharing, collaboration, or team features
3. The application is single-tenant: each user manages only their own tasks
4. Moderate concurrent usage (free-tier limits of Firebase and Railway are sufficient)

## Data Assumptions

1. Firestore's document-based storage is sufficient for task data (no complex relational queries needed)
2. Task search is client-side (Firestore doesn't support full-text search); acceptable for typical personal task volumes
3. No offline support is required — users need internet connectivity
4. Tasks are not versioned — there is no history/audit trail of changes

## Design Assumptions

1. Dark theme is the primary (and only) theme — no light mode toggle
2. Desktop-first design that is responsive down to mobile
3. Kanban board with three fixed columns (To Do, In Progress, Done)
4. AI suggestions are advisory — they do not auto-apply to tasks

## Constraints

1. **Time-boxed assessment** — feature scope is limited to core task management
2. **Free-tier services** — no paid API plans or premium hosting
3. **No backend database migration** — Firestore is schemaless, no migration tooling needed
4. **Single region deployment** — no multi-region or CDN configuration
