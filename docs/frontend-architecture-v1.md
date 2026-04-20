# Frontend Architecture v1

## Purpose

The frontend is structured around a shared application shell and role-aware routing model for the University Exam Management Platform. The goal is to keep the user experience consistent while ensuring each role sees only the navigation and entry points that belong to that access level.

## Core Principles

- One shared shell for all protected pages
- Role-aware navigation instead of hardcoded page menus
- Login integrated with backend identity endpoints
- Route guards that protect both authentication and role access
- Clear separation between admin operations and exam-content workspaces
- Responsive layout that remains usable on desktop and mobile

## Application Layers

### 1. Entry Layer

Files:

- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/routes/AppRoutes.jsx`

Responsibilities:

- Bootstraps React Router
- Loads global UI and theme styles
- Defines public and protected routes
- Redirects signed-in users to their role-specific home route

### 2. Authentication Layer

Files:

- `frontend/src/lib/auth.js`
- `frontend/src/hooks/useCurrentUser.js`
- `frontend/src/routes/ProtectedRoute.jsx`
- `frontend/src/routes/RoleGuard.jsx`
- `frontend/src/routes/SessionHomeRedirect.jsx`

Responsibilities:

- Persist JWT token
- Cache current user profile in local storage
- Load `/auth/me` to resolve the active session
- Redirect unauthenticated users to `/login`
- Redirect authenticated users away from routes outside their role scope

## Role Entry Logic

Login uses `/auth/login`, then resolves `/auth/me`, then redirects using the role home map:

- `Admin -> /admin/users`
- `Professor -> /exams`
- `Assistant -> /exams`
- `Student -> /dashboard`

This makes entry behavior role-aware even though all roles still share the same shell system and dashboard component family.

### 3. Shell Layer

Files:

- `frontend/src/components/AppShell.jsx`
- `frontend/src/styles/ui.css`
- `frontend/src/styles/theme.css`

Responsibilities:

- Shared sidebar
- Shared top header
- Mobile menu toggle
- Role badge and signed-in identity block
- Consistent action area for page-level CTA buttons
- Reusable layout for admin, dashboard, and exam screens

## Navigation Model

Role-specific navigation is centralized in:

- `frontend/src/lib/permissions.js`

This file defines:

- role normalization
- home-route mapping
- navigation items per role
- feature-level permission helpers

That keeps the navigation model in one place instead of scattering checks across pages.

### 4. Page Layer

Pages currently organized around role entry and operational workspaces:

- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/admin/*`
- `frontend/src/pages/exams/*`

Each page:

- loads its own data
- uses `useCurrentUser()` for session-aware rendering
- renders inside `AppShell` when protected
- exposes only actions appropriate for the resolved role

## Authorization UX Boundaries

The frontend now enforces these interaction rules:

- Admin navigation only exposes user and academic administration pages
- Admin is not given exam workspace navigation
- Professor can access exam listing, exam creation, and question authoring
- Assistant can access exam workspace and exam creation entry
- Student can access dashboard and exam visibility entry points only

Note: backend authorization remains the source of truth. The frontend shell reduces accidental cross-navigation and provides a cleaner role-specific UX.

## Data Flow

### Authentication flow

1. User submits credentials on login page
2. `login()` stores token and basic profile data
3. `me()` resolves the current role from the backend
4. Router redirects to the role home route
5. Protected pages use `useCurrentUser()` to hydrate profile state

### Protected page flow

1. `ProtectedRoute` checks token presence
2. `RoleGuard` checks role authorization for route groups
3. Page loads its data APIs
4. Page renders inside `AppShell`

## Styling System

Two global files define the UI language:

- `theme.css` for tokens such as colors, radius, typography, shadows
- `ui.css` for components and layout patterns

Primary reusable patterns:

- shell layout
- sidebar navigation
- topbar
- cards
- forms
- tables
- status pills
- alert and empty states

## Responsive Strategy

Responsive behavior is handled mostly in `ui.css`:

- desktop uses persistent sidebar layout
- tablet/mobile collapses the grid
- mobile uses a menu button and sidebar overlay pattern
- forms, tables, and action rows wrap to vertical stacking when space narrows

## Current Risks / Next Iteration

- Some backend permissions still allow broader access than the product rules intend
- Role dashboards currently use placeholder metrics and should later bind to real summary APIs
- Student-specific exam visibility is still dependent on later eligibility work
- Assistant exam authoring boundaries need tighter backend parity in later sprints

## Why This Fits Alma's Scope

This structure directly supports Alma's Sprint 1 feature:

- product shell
- login page redesign
- role-aware redirect
- role navigation
- responsive layout
- design system foundations
