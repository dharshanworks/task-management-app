# Requirements

## Functional Requirements

### FR-1: User Authentication
- Users must be able to sign in using their Google account via Firebase Authentication
- Users must be able to sign out
- Authenticated sessions must persist across page refreshes
- All API endpoints must require valid authentication tokens

### FR-2: Task Management (CRUD)
- **Create**: Users can create tasks with title (required), description, status, priority, and due date
- **Read**: Users can view all their tasks in a Kanban-style board organized by status
- **Update**: Users can edit any field of an existing task, including changing status by drag-and-drop
- **Delete**: Users can delete tasks they own

### FR-3: Task Organization
- Tasks are organized into three status columns: To Do, In Progress, Done
- Tasks can be moved between columns via drag-and-drop or a status dropdown
- Tasks can be filtered by priority level
- Tasks can be searched by title or description text

### FR-4: Task Validation
- Task titles are required and must not exceed 200 characters
- Task descriptions are optional but limited to 2000 characters
- Status must be one of: `todo`, `in-progress`, `done`
- Priority must be one of: `low`, `medium`, `high`
- Due dates must be valid ISO dates when provided

### FR-5: AI Task Assistant
- Users can request AI-powered suggestions to improve any task
- The AI assistant provides: improved title, improved description, actionability suggestions, subtask breakdown, time estimation, and priority recommendation
- AI functionality uses Google Gemini API
- Graceful fallback when AI service is unavailable

### FR-6: Data Ownership
- Tasks are private and scoped to the authenticated user
- Users cannot view, edit, or delete tasks belonging to other users
- Server-side ownership checks enforce data isolation

## Non-Functional Requirements

### NFR-1: Performance
- Frontend build under 500KB gzipped
- API responses under 500ms for CRUD operations
- Frontend builds in under 2 seconds

### NFR-2: Security
- All API endpoints protected by Firebase Authentication
- Rate limiting to prevent abuse (200 req/15min general, 10 req/min for AI)
- Helmet.js for HTTP security headers
- CORS restricted to allowed frontend origin
- No secrets committed to version control
- Request body size limited to 10KB

### NFR-3: Usability
- Responsive design supporting desktop, tablet, and mobile
- Dark theme with accessible color contrast
- Keyboard navigation support (Escape to close modals)
- Loading states and error feedback via toast notifications
- Drag-and-drop task management

### NFR-4: Reliability
- Graceful error handling with user-friendly messages
- AI service fallback when Gemini API is unavailable
- Global error handler catches unhandled exceptions
