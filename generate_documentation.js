const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} = require('docx');

// Brand Colors
const COLOR_PRIMARY = '4F46E5';     // Indigo-600
const COLOR_SECONDARY = '7C3AED';   // Purple-600
const COLOR_DARK = '0F172A';        // Slate-900
const COLOR_TEXT = '334155';        // Slate-700
const COLOR_MUTED = '64748B';       // Slate-500
const COLOR_LIGHT_BG = 'F8FAFC';    // Slate-50
const COLOR_BORDER = 'E2E8F0';      // Slate-200
const COLOR_ACCENT_BG = 'EEF2FF';   // Indigo-50
const COLOR_WHITE = 'FFFFFF';
const COLOR_SUCCESS = '059669';     // Emerald-600
const COLOR_WARNING = 'D97706';     // Amber-600
const COLOR_DANGER = 'DC2626';      // Red-600

function createCell(text, isHeader = false, widthPercent = null, customBg = null, bold = false) {
  return new TableCell({
    width: widthPercent ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: {
      fill: customBg || (isHeader ? COLOR_PRIMARY : COLOR_WHITE),
      type: ShadingType.CLEAR,
    },
    margins: { top: 140, bottom: 140, left: 180, right: 180 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader || bold,
            color: isHeader ? COLOR_WHITE : COLOR_TEXT,
            size: isHeader ? 20 : 19,
            font: 'Segoe UI',
          }),
        ],
      }),
    ],
  });
}

function createHeading1(title) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 360, after: 140 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32,
          color: COLOR_PRIMARY,
          font: 'Segoe UI',
        }),
      ],
    }),
  ];
}

function createHeading2(title) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 26,
          color: COLOR_SECONDARY,
          font: 'Segoe UI',
        }),
      ],
    }),
  ];
}

function createHeading3(title) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 22,
          color: COLOR_DARK,
          font: 'Segoe UI',
        }),
      ],
    }),
  ];
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: options.before || 80, after: options.after || 80 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italics || false,
        size: options.size || 21,
        color: options.color || COLOR_TEXT,
        font: 'Segoe UI',
      }),
    ],
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix,
        bold: true,
        size: 21,
        color: COLOR_DARK,
        font: 'Segoe UI',
      })
    );
  }
  children.push(
    new TextRun({
      text,
      size: 21,
      color: COLOR_TEXT,
      font: 'Segoe UI',
    })
  );

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 50, after: 50 },
    children,
  });
}

function createCallout(title, text, type = 'info') {
  let borderColor = COLOR_PRIMARY;
  let bgColor = COLOR_ACCENT_BG;
  if (type === 'success') {
    borderColor = COLOR_SUCCESS;
    bgColor = 'ECFDF5';
  } else if (type === 'warning') {
    borderColor = COLOR_WARNING;
    bgColor = 'FFFBEB';
  } else if (type === 'danger') {
    borderColor = COLOR_DANGER;
    bgColor = 'FEF2F2';
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 240, right: 200 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
            },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 21,
                    color: borderColor,
                    font: 'Segoe UI',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text,
                    size: 20,
                    color: COLOR_DARK,
                    font: 'Segoe UI',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

async function generateDocx() {
  const doc = new Document({
    creator: 'TaskFlow Engineering Team',
    title: 'TaskFlow — Comprehensive Project Documentation & Technical Architecture',
    description: 'Detailed software design, architecture, API reference, security model, and deployment specification for TaskFlow.',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'TaskFlow — Software Engineering & Technical Documentation',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Page ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ==================== COVER PAGE ====================
          new Paragraph({ spacing: { before: 800, after: 120 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 140 },
            children: [
              new TextRun({
                text: 'TASKFLOW',
                bold: true,
                size: 56,
                color: COLOR_PRIMARY,
                font: 'Segoe UI',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 180 },
            children: [
              new TextRun({
                text: 'Smart Task Management Application',
                bold: true,
                size: 30,
                color: COLOR_SECONDARY,
                font: 'Segoe UI',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 360 },
            children: [
              new TextRun({
                text: 'Comprehensive System Architecture, Requirements, API Specification & Deployment Guide',
                size: 22,
                color: COLOR_MUTED,
                font: 'Segoe UI',
              }),
            ],
          }),

          createCallout(
            '🌟 LIVE PRODUCTION SYSTEM',
            'Application URL: https://task-management-app-production-b7ee.up.railway.app\nRepository: https://github.com/dharshanworks/task-management-app\nHealth Check: https://task-management-app-production-b7ee.up.railway.app/api/health',
            'success'
          ),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Meta Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Document Attribute', true, 40),
                  createCell('Specification / Details', true, 60),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Project Name', false, 40, COLOR_LIGHT_BG, true),
                  createCell('TaskFlow (Smart Task Management)', false, 60),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Document Version', false, 40, COLOR_LIGHT_BG, true),
                  createCell('1.0.0 (Production Release)', false, 60),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Architecture Pattern', false, 40, COLOR_LIGHT_BG, true),
                  createCell('Decoupled SPA + RESTful API Backend + Managed Cloud Services', false, 60),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Primary Tech Stack', false, 40, COLOR_LIGHT_BG, true),
                  createCell('React 18, Vite, Express.js (Node.js), Firebase Auth, Cloud Firestore, Google Gemini API, Railway PaaS', false, 60),
                ],
              }),
              new TableRow({
                children: [
                  createCell('AI Engine', false, 40, COLOR_LIGHT_BG, true),
                  createCell('Google Gemini 3.6 Flash / 2.0 Flash (@google/generative-ai)', false, 60),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Deployment Target', false, 40, COLOR_LIGHT_BG, true),
                  createCell('Railway Cloud Container (Automated CI/CD from GitHub)', false, 60),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // ==================== 1. EXECUTIVE SUMMARY ====================
          ...createHeading1('1. Executive Summary'),
          createParagraph('TaskFlow is a state-of-the-art, full-stack task management web application engineered to combine frictionless task organization with generative artificial intelligence. Built for individuals and high-velocity professionals, TaskFlow provides an intuitive Kanban board interface where users can seamlessly track tasks across To Do, In Progress, and Done lifecycles using interactive drag-and-drop operations, real-time filtering, and multi-criteria searching.'),
          createParagraph('A core differentiator of TaskFlow is its deeply integrated AI Task Assistant, powered by Google Gemini API. When a user requests task enhancement, the assistant analyzes the task title and description to produce actionable title rewrites, clear outcome descriptions, prioritized subtask decompositions, duration estimates, and priority suggestions. All AI recommendations adhere to an advisory human-in-the-loop paradigm, giving users final review and one-click application control.'),
          createParagraph('The entire architecture is deployed in production on Railway as a unified service, incorporating enterprise-grade security protocols: Firebase ID token cryptographic authentication, server-side data ownership enforcement, rate limiting, and HTTP header hardening with Helmet.js.'),

          // ==================== 2. SYSTEM ARCHITECTURE & TECH STACK ====================
          ...createHeading1('2. System Architecture & Technology Stack'),
          createParagraph('TaskFlow is structured according to a multi-tier client-server architecture with managed cloud services:'),
          createBullet('Single-Page Application (SPA) built with React 18 and Vite. Implements modular UI components, Context API state management, and a custom CSS design system using glassmorphism aesthetics.', 'Frontend Client Layer: '),
          createBullet('RESTful API server built with Express.js running on Node.js. Enforces authentication, input validation, rate limiting, and business logic.', 'Backend Application Layer: '),
          createBullet('Cloud Firestore provides high-reliability, document-based NoSQL storage with millisecond response times and automated scaling.', 'Data Persistence Layer: '),
          createBullet('Firebase Authentication manages secure OAuth 2.0 Google Sign-In with automated token renewal and cryptographic JWT signature verification.', 'Identity & Security Layer: '),
          createBullet('Google Gemini API (gemini-3.6-flash / gemini-2.0-flash) processes natural language prompts and yields structured JSON suggestions.', 'Artificial Intelligence Layer: '),
          createBullet('Railway PaaS builds frontend assets via Vite, bundles static assets into Express, and serves API endpoints on a single scalable domain.', 'DevOps & Hosting: '),

          new Paragraph({ spacing: { before: 140, after: 100 } }),

          // Tech Stack Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Component', true, 25),
                  createCell('Technology', true, 30),
                  createCell('Role & Purpose', true, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Frontend UI', false, 25, COLOR_LIGHT_BG, true),
                  createCell('React 18.3 + Vite 6.0', false, 30),
                  createCell('Ultra-fast SPA rendering, HMR, drag-and-drop Kanban board, modals', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Styling Engine', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Vanilla CSS Design Tokens', false, 30),
                  createCell('Bespoke dark glassmorphism, 60+ CSS variables, zero runtime overhead', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Backend API', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Express.js 4.21 (Node.js)', false, 30),
                  createCell('RESTful endpoints, error middleware, input sanitation, static serving', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Authentication', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Firebase Auth (Google OAuth)', false, 30),
                  createCell('Popup and redirect Google authentication, ID token issuance', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Admin Security', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Firebase Admin SDK 13.0', false, 30),
                  createCell('Cryptographic server-side JWT verification, Firestore admin access', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Database', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Cloud Firestore', false, 30),
                  createCell('Scalable NoSQL document store, user-isolated task collections', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('AI Engine', false, 25, COLOR_LIGHT_BG, true),
                  createCell('@google/generative-ai', false, 30),
                  createCell('Gemini flash model generating structured task suggestions', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Traffic Security', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Helmet + express-rate-limit', false, 30),
                  createCell('HTTP security headers, general rate limiting (200/15min) & AI rate limiting (10/min)', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Cloud Hosting', false, 25, COLOR_LIGHT_BG, true),
                  createCell('Railway (Nixpacks)', false, 30),
                  createCell('Automated git-driven build, health checks, HTTPS public domain', false, 45),
                ],
              }),
            ],
          }),

          // ==================== 3. REQUIREMENTS SPECIFICATION ====================
          ...createHeading1('3. Requirements Specification'),
          ...createHeading2('3.1 Functional Requirements'),
          createBullet('Users authenticate via Google accounts using Firebase Authentication. Sessions persist across reloads with automated token refresh. All API operations require valid Bearer tokens.', 'FR-1: User Authentication — '),
          createBullet('Users can Create, Read, Update, and Delete tasks. Fields include title (required, max 200 chars), description (optional, max 2000 chars), status, priority, and due date.', 'FR-2: Task CRUD Operations — '),
          createBullet('Tasks are visually grouped into three status columns: To Do, In Progress, and Done. Drag-and-drop and dropdown status updates are supported. Client-side priority filtering and real-time text search.', 'FR-3: Kanban Board Organization — '),
          createBullet('Rigorous server-side and client-side validation. Enforces strict enums (status: todo, in-progress, done; priority: low, medium, high), sanitized string trimming, and ISO 8601 date validation.', 'FR-4: Data Validation & Sanitization — '),
          createBullet('On-demand task refinement powered by Gemini AI. Provides improved title, outcome description, 3 actionable recommendations, subtasks breakdown, estimated completion time, and recommended priority.', 'FR-5: AI Task Assistant — '),
          createBullet('Strict user data isolation. Every task document contains a userId foreign key. Server-side checks verify that the requesting user matches the task owner before permitting any read or write.', 'FR-6: Privacy & Data Ownership — '),

          ...createHeading2('3.2 Non-Functional Requirements'),
          createBullet('Gzipped frontend build size under 100KB (excluding Firebase vendor bundle). API response times under 500ms for CRUD operations. Frontend initial render within 1.5 seconds.', 'NFR-1: Performance — '),
          createBullet('HTTPS enforced across all endpoints. ID tokens verified cryptographically. Helmet security headers, CORS origin restriction, rate-limiting (200 req/15min general; 10 req/min for AI), and 10KB request body size caps.', 'NFR-2: Security — '),
          createBullet('Dark theme with WCAG AA compliant color contrast ratios. Responsive design supporting mobile (<768px), tablet (<1024px), and desktop (>1024px). Keyboard accessibility (Escape key modal dismissal, Tab traversal). Non-blocking toast alerts with aria-live="polite".', 'NFR-3: Usability & Accessibility — '),
          createBullet('Graceful degradation. If the Gemini API is unreachable or rate-limited, the system falls back to structured heuristic suggestions without crashing or blocking the user.', 'NFR-4: Reliability & Resiliency — '),

          // ==================== 4. DATABASE & DATA MODEL ====================
          ...createHeading1('4. Database Design & Data Model'),
          createParagraph('TaskFlow utilizes Cloud Firestore, Google Cloud’s highly scalable NoSQL document database. Data is organized into a top-level collection named "tasks". Each task document is indexed by a unique Firestore auto-generated document ID.'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Field Name', true, 20),
                  createCell('Data Type', true, 18),
                  createCell('Constraints', true, 22),
                  createCell('Description & Example', true, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('id', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String', false, 18),
                  createCell('Auto-generated, Unique', false, 22),
                  createCell('Firestore document key (e.g., "abC123XyZ")', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('title', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String', false, 18),
                  createCell('Required, 1 - 200 chars', false, 22),
                  createCell('Concise summary of the task', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('description', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String', false, 18),
                  createCell('Optional, max 2000 chars', false, 22),
                  createCell('Detailed specifications, context, or subtask notes', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('status', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String (Enum)', false, 18),
                  createCell("'todo' | 'in-progress' | 'done'", false, 22),
                  createCell('Current lifecycle column on the Kanban board', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('priority', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String (Enum)', false, 18),
                  createCell("'low' | 'medium' | 'high'", false, 22),
                  createCell('Urgency indicator (default: medium)', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('dueDate', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String (ISO 8601) / Null', false, 18),
                  createCell('Valid date string or null', false, 22),
                  createCell('Deadline timestamp (e.g., "2026-09-25T18:00:00.000Z")', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('userId', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String', false, 18),
                  createCell('Required, Foreign Key', false, 22),
                  createCell('Firebase Auth UID of the task owner', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('createdAt', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String (ISO 8601)', false, 18),
                  createCell('Server timestamp', false, 22),
                  createCell('Creation date for chronological sorting', false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell('updatedAt', false, 20, COLOR_LIGHT_BG, true),
                  createCell('String (ISO 8601)', false, 18),
                  createCell('Server timestamp', false, 22),
                  createCell('Timestamp of most recent modification', false, 40),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 120, after: 80 } }),
          createParagraph('Architecture Note on Firestore Queries: The backend queries tasks using `where("userId", "==", userId)` and performs status, priority, and text search filtering in Node.js memory. This deliberate design decision eliminates the operational complexity of creating and managing composite Firestore indexes across dynamic filter permutations.'),

          // ==================== 5. REST API SPECIFICATION ====================
          ...createHeading1('5. RESTful API Specification'),
          createParagraph('All API routes reside under the `/api` prefix. Protected routes require a valid Firebase ID token supplied in the HTTP Authorization header: `Authorization: Bearer <ID_TOKEN>`.'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Method', true, 15),
                  createCell('Endpoint', true, 28),
                  createCell('Auth', true, 12),
                  createCell('Description & Query Params', true, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('GET', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/health', false, 28),
                  createCell('None', false, 12),
                  createCell('Server health, timestamp, and environment status', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('GET', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/tasks', false, 28),
                  createCell('Bearer', false, 12),
                  createCell('Fetch user tasks. Query params: status, priority, search', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('POST', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/tasks', false, 28),
                  createCell('Bearer', false, 12),
                  createCell('Create task. Body: { title, description?, status?, priority?, dueDate? }', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('GET', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/tasks/:id', false, 28),
                  createCell('Bearer', false, 12),
                  createCell('Retrieve single task by ID (validates ownership)', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('PUT', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/tasks/:id', false, 28),
                  createCell('Bearer', false, 12),
                  createCell('Update task fields (partial updates allowed; updates updatedAt)', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('DELETE', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/tasks/:id', false, 28),
                  createCell('Bearer', false, 12),
                  createCell('Permanently remove task (validates ownership)', false, 45),
                ],
              }),
              new TableRow({
                children: [
                  createCell('POST', false, 15, COLOR_LIGHT_BG, true),
                  createCell('/api/ai/improve-task', false, 28),
                  createCell('Bearer', false, 12),
                  createCell('AI task enhancement suggestions. Rate-limited to 10 req/min', false, 45),
                ],
              }),
            ],
          }),

          // ==================== 6. AI ASSISTANT SPECIFICATION ====================
          ...createHeading1('6. AI Assistant Architecture & Prompt Engineering'),
          createParagraph('The AI Assistant is built using Google Gemini API (`gemini-3.6-flash` / `gemini-2.0-flash`), which provides high-throughput, low-latency reasoning suitable for interactive web applications.'),
          ...createHeading2('6.1 Prompt Engineering Strategy'),
          createParagraph('The backend passes a system prompt instructing the model to act as an expert productivity coach and output strict JSON without markdown formatting or code blocks:'),
          createBullet('improvedTitle: Rewrites ambiguous phrases into punchy, action-oriented directives.', '1. Title Refinement — '),
          createBullet('improvedDescription: Expands sparse notes into measurable deliverables with acceptance criteria.', '2. Description Expansion — '),
          createBullet('suggestions: Delivers 3 concrete recommendations for scope clarity and obstacle mitigation.', '3. Actionable Coaching — '),
          createBullet('subtasks: Deconstructs large work items into smaller, sequential execution steps.', '4. Subtask Decomposition — '),
          createBullet('estimatedTime: Estimates duration (e.g., "45 minutes", "2 hours") for schedule planning.', '5. Time Estimation — '),
          createBullet('suggestedPriority: Suggests low, medium, or high priority based on task urgency and impact.', '6. Priority Recommendation — '),

          ...createHeading2('6.2 Advisory Human-In-The-Loop Workflow'),
          createParagraph('AI suggestions in TaskFlow are strictly advisory. Suggestions are rendered in a dedicated slide-over panel. The original task is never modified automatically. The user reviews the side-by-side comparison, inspects the recommended subtasks, and may either click "Apply Improvements" or dismiss the panel.'),

          // ==================== 7. SECURITY & DATA PRIVACY ====================
          ...createHeading1('7. Security, Privacy & Data Protection'),
          createParagraph('TaskFlow enforces a zero-trust, defense-in-depth security model:'),
          createBullet('All client requests transmit Firebase ID tokens signed with asymmetric Google private keys. The backend verifies cryptographic signatures, expiration times, and audience claims via the Firebase Admin SDK.', '1. Cryptographic Authentication — '),
          createBullet('Direct object references (e.g., /api/tasks/:id) are always guarded by `task.userId === req.user.uid`. If an authenticated user attempts to read, edit, or delete another user’s task, the API aborts with a 403 Forbidden status.', '2. IDOR Prevention & Tenant Isolation — '),
          createBullet('Helmet.js manages strict HTTP response headers, preventing clickjacking, MIME-type sniffing, and cross-site scripting attacks.', '3. Header Hardening — '),
          createBullet('Two-tiered rate limiting: A general limiter permits up to 200 requests per 15-minute window per IP, while the AI endpoint enforces a strict 10 requests per minute cap to prevent resource exhaustion.', '4. Rate Limiting Throttling — '),
          createBullet('No sensitive credentials, service account keys, or API tokens are checked into version control. Environment variables are loaded at runtime via dotenv in development and securely injected by Railway in production.', '5. Secrets Management — '),

          // ==================== 8. DEVOPS & DEPLOYMENT ====================
          ...createHeading1('8. DevOps & Cloud Deployment (Railway)'),
          createParagraph('TaskFlow is deployed on Railway as a unified full-stack service with automated continuous deployment triggered by commits to the GitHub `main` branch.'),
          createBullet('Railway uses Nixpacks to execute `npm run build` in the frontend directory, compiling the Vite React application into static production assets stored in `frontend/dist`. It then executes `npm install` in the backend.', 'Build Pipeline: '),
          createBullet('Express starts on `PORT`, mounting static assets from `frontend/dist` and directing all API traffic to `/api/*`. A catch-all route serves `index.html` for client-side React routing.', 'Unified Runtime: '),
          createBullet('Configured to `/api/health` with automated restart policies on failure.', 'Health Check Monitoring: '),

          createCallout(
            '⚠️ CRITICAL PRODUCTION CONFIGURATION: FIREBASE AUTHORIZED DOMAINS',
            'To enable Google Sign-In on the production domain (https://task-management-app-production-b7ee.up.railway.app), the Railway domain MUST be registered in the Firebase Console:\n1. Open Firebase Console -> Project: task-management-app-001\n2. Navigate to Authentication -> Settings -> Authorized domains\n3. Click "Add domain" and enter: task-management-app-production-b7ee.up.railway.app\n4. Click Save. Google OAuth immediately accepts sign-in requests without redeploying.',
            'warning'
          ),

          // ==================== 9. TECHNICAL DECISION RECORDS ====================
          ...createHeading1('9. Technical Decision Records (TDRs)'),
          createParagraph('Key engineering decisions and their rationale:'),
          createBullet('Chosen for instant build speeds, HMR, component composition, and lightweight bundle footprint compared to SSR frameworks like Next.js.', 'TDR-1: React 18 + Vite — '),
          createBullet('Lightweight, battle-tested REST API framework offering maximum control over middleware (CORS, rate limiting, token verification).', 'TDR-2: Express.js (Node.js) — '),
          createBullet('Turnkey Google OAuth 2.0 implementation with automated token lifecycle and client-side SDK integration.', 'TDR-3: Firebase Authentication — '),
          createBullet('Flexible NoSQL document model ideally matching task data; seamless integration with Firebase security ecosystem; no schema migration overhead.', 'TDR-4: Cloud Firestore — '),
          createBullet('Fast inference, high rate limits, structured JSON generation capabilities, and cost efficiency.', 'TDR-5: Google Gemini API (Flash Model) — '),
          createBullet('Eliminates CSS runtime overhead, prevents JSX clutter from utility classes, and provides precise control over glassmorphism and theme variables.', 'TDR-6: Vanilla CSS with Design Tokens — '),
          createBullet('Unified full-stack hosting supporting single-domain static serving and backend APIs with automated Git deployment.', 'TDR-7: Railway PaaS — '),

          // ==================== 10. PROJECT DIRECTORY STRUCTURE ====================
          ...createHeading1('10. Project Directory & Key Files'),
          createParagraph('The repository is organized into distinct, clean directories:'),
          createBullet('Contains the React SPA, including components for Tasks, Auth, AI, Layout, API services, and CSS design system.', 'frontend/ — '),
          createBullet('Contains the Express REST API, Firebase Admin configuration, authentication middleware, validators, AI services, and Jest unit tests.', 'backend/ — '),
          createBullet('Contains system documentation including requirements.md, decisions.md, assumptions.md, usability.md, ai-usage.md, and deployment.md.', 'docs/ — '),
          createBullet('Root orchestration package managing concurrent local development (`npm run dev`) and unified production build.', 'package.json — '),
          createBullet('Railway configuration declaring the Nixpacks build command, start command, and healthcheck path.', 'railway.json — '),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, 'TaskFlow_Project_Documentation.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Word document successfully generated at: ${outputPath}`);
}

generateDocx().catch((err) => {
  console.error('Failed to generate docx:', err);
  process.exit(1);
});
