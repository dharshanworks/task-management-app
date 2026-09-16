# AI-Assisted Development & AI Usage

## AI in the Product

### AI Task Assistant Feature
The application includes an AI-powered task improvement assistant that uses **Google Gemini API (gemini-2.0-flash)** to analyze task titles and descriptions and provide actionable suggestions.

#### What the AI Does
1. **Improves task titles** — Rewrites titles to be clearer and more actionable
2. **Improves descriptions** — Expands descriptions with specific, measurable outcomes
3. **Provides suggestions** — Offers 3 concrete tips for better task formulation
4. **Suggests subtasks** — Breaks complex tasks into smaller, manageable steps
5. **Estimates time** — Provides a rough time estimate for completion
6. **Recommends priority** — Suggests an appropriate priority level

#### Implementation Details
- **Model**: Gemini 2.0 Flash (optimized for speed and cost)
- **Prompt Engineering**: Structured system prompt requesting JSON output with specific fields
- **Error Handling**: Graceful fallback to generic suggestions when API fails
- **Rate Limiting**: 10 requests per minute per user to prevent abuse
- **Response Parsing**: Strips markdown code fences and validates JSON structure

#### User Control
- AI suggestions are **advisory only** — never auto-applied
- Users explicitly click "Apply Improvements" to accept changes
- Original task data is preserved until the user confirms
- Users can dismiss suggestions without any changes

## AI in Development

### How AI Assisted the Development Process

AI (Google Gemini / Antigravity) was used throughout the development process as a pair programming partner. Here's how it contributed:

#### Architecture & Planning
- Analyzed project requirements and proposed the tech stack
- Created the implementation plan with phased development approach
- Designed the API structure and component hierarchy

#### Code Generation
- Generated boilerplate code for Express.js server setup, middleware, and routes
- Created React component scaffolding with proper patterns (hooks, context, etc.)
- Built the CSS design system with custom properties and glassmorphism effects
- Wrote the Gemini API integration with prompt engineering

#### Quality Assurance
- Generated comprehensive unit tests for input validation
- Verified frontend build integrity
- Applied security best practices (helmet, CORS, rate limiting, input validation)
- Reviewed commit history for Conventional Commits compliance

#### Documentation
- Generated all project documentation (requirements, assumptions, decisions, usability)
- Wrote meaningful commit messages following Conventional Commits standard
- Created the .env.example template with clear variable descriptions

### AI Usage Principles
1. **AI as accelerator, not replacement** — AI generated initial code, but all architecture decisions were reviewed and validated
2. **Human-in-the-loop** — Every AI-generated piece of code was reviewed before committing
3. **Transparency** — This document openly documents all AI usage in both the product and development process
4. **Quality first** — AI suggestions were evaluated against best practices, not blindly accepted
