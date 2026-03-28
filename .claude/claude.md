# Project: FitLog

## Overview
FitLog is a fitness training management application designed for personal use, with potential to evolve into a SaaS platform.

Target users:
- End users (gym practitioners)
- Personal trainers
- Gyms

The system allows users to create workouts, manage exercises, and track training progress over time.

---

## Tech Stack

### Backend
- Laravel (API only)
- MySQL
- JWT Authentication
- REST API (versioned: /api/v1)

### Frontend
- React (SPA)
- Vite
- TypeScript (strict mode required)
- TailwindCSS

---

## Architecture

- Monorepo structure:
  - /backend → Laravel API
  - /frontend → React application

- Frontend and backend MUST be fully decoupled
- Communication strictly via HTTP (REST)

---

## Core Features (MVP)

### Authentication
- User registration
- Login
- JWT-based authentication
- User roles:
  - admin (future)
  - trainer
  - regular user

### Workouts
- Create workouts (A/B/C or custom)
- List workouts
- Update/Delete workouts

### Exercises
- Add exercises to workouts
- Define:
  - sets
  - reps
  - order

### Training Execution
- Log workout execution
- Record:
  - weight
  - reps performed
  - date

### History
- View past workouts
- Track progression per exercise

---

## API Design Rules

- Follow REST principles strictly
- Use versioning: `/api/v1`
- Use plural resource names:
  - /workouts
  - /exercises
- Use proper HTTP methods:
  - GET, POST, PUT/PATCH, DELETE
- Return consistent JSON structures

---

## Code Standards

### General
- Follow Clean Code principles
- Follow SOLID principles
- Prefer readability over cleverness
- Avoid overengineering

### Backend (Laravel)
- Use Controllers, Services, and Repositories (when needed)
- Keep controllers thin
- Business logic must not live in controllers
- Use Form Requests for validation

### Frontend (React)
- Use functional components only
- Use hooks
- Keep components small and reusable
- Separate UI from business logic
- Use services/api layer for HTTP calls

---

## TypeScript Rules

- Strict typing is REQUIRED
- Do not use `any`
- Always define interfaces/types for:
  - API responses
  - entities
  - props

---

## UI/UX

- Use TailwindCSS
- Support both light and dark themes
- Focus on clean and minimal UI
- Prioritize usability over visual complexity

---

## Development Approach (CRITICAL)

This project follows a **Spec-Driven Development** approach.

### Before writing any code:
1. The AI MUST:
   - Understand the feature request
   - Break it down into steps
   - Identify ambiguities
   - Ask clarifying questions if needed

2. The AI MUST propose:
   - Architecture decisions
   - Data models
   - API contracts
   - Component structure

3. ONLY AFTER approval:
   - Start implementation

---

## AI Behavior Rules

- NEVER assume missing requirements
- ALWAYS ask when something is unclear
- DO NOT jump straight into coding
- DO NOT refactor existing code without explicit permission
- Follow the defined architecture strictly

---

## Future Considerations

- Mobile app (React Native or Expo)
- SaaS features (multi-tenancy)
- Performance optimization
- Advanced analytics (progress tracking)

---

## Priorities

1. Simplicity
2. Maintainability
3. Scalability
4. Developer experience

---

## Non-Goals (for now)

- No premature optimization
- No microservices
- No complex state management initially
