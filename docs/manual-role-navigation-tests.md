# Manual Role Navigation Tests

## Scope

This checklist verifies Alma's feature slice:

- login page
- shared shell
- role-aware redirect
- role-aware navigation
- protected route behavior
- responsive behavior baseline

## Test Matrix

### 1. Admin login and navigation

Precondition:

- active admin account exists

Steps:

1. Open `/login`
2. Sign in as admin
3. Confirm redirect to `/admin/users`
4. Confirm sidebar shows only:
   - Overview
   - Users
   - Courses
   - Offerings
5. Confirm exam workspace links are not visible
6. Try entering `/exams` manually

Expected:

- login succeeds
- admin lands in admin workspace
- exam navigation is hidden
- manual `/exams` access redirects away from exam workspace

### 2. Professor login and navigation

Precondition:

- active professor account exists

Steps:

1. Open `/login`
2. Sign in as professor
3. Confirm redirect to `/exams`
4. Confirm sidebar shows:
   - Overview
   - My exams
   - Create exam
5. Open an exam detail page
6. Confirm `Add question` is available
7. Try opening `/admin/users`

Expected:

- professor lands in exam workspace
- professor sees exam authoring navigation
- admin routes are blocked

### 3. Assistant login and navigation

Precondition:

- active assistant account exists

Steps:

1. Open `/login`
2. Sign in as assistant
3. Confirm redirect to `/exams`
4. Confirm sidebar shows:
   - Overview
   - Assigned exams
5. Confirm admin pages are not visible in the sidebar
6. Try opening `/admin/courses`
7. Try opening `/exams/:examId/questions/new`

Expected:

- assistant lands in exam workspace
- assistant sees a reduced menu
- admin pages are blocked
- question-authoring route is blocked by the frontend guard

### 4. Student login and navigation

Precondition:

- active student account exists

Steps:

1. Open `/login`
2. Sign in as student
3. Confirm redirect to `/dashboard`
4. Confirm sidebar shows:
   - Overview
   - Eligible exams
5. Try opening `/admin/users`
6. Try opening `/exams/new`

Expected:

- student lands on dashboard
- student sees only student-facing navigation
- admin and authoring routes are blocked

### 5. Route protection without session

Steps:

1. Clear token/local storage
2. Attempt to open:
   - `/dashboard`
   - `/admin/users`
   - `/exams`

Expected:

- all routes redirect to `/login`

### 6. Responsive shell baseline

Steps:

1. Open any protected page on desktop width
2. Reduce viewport to tablet/mobile width
3. Confirm sidebar collapses
4. Open menu button
5. Navigate to another route

Expected:

- mobile menu opens as overlay
- overlay closes after navigation
- page header and action buttons remain readable

## Result Template

Use this compact result format when executing the checks:

- `Admin login / redirect: Pass | Fail`
- `Professor navigation isolation: Pass | Fail`
- `Assistant restricted routes: Pass | Fail`
- `Student authoring guard: Pass | Fail`
- `Unauthenticated redirect: Pass | Fail`
- `Responsive shell: Pass | Fail`

## Current Note

This document defines the manual test pack for the feature. Demo credentials available for Sprint 1 role checks:

- `admin@onlineexam.com / Password123!`
- `prof@onlineexam.com / Password123!`
- `assistant@onlineexam.com / Password123!`
- `student@onlineexam.com / Password123!`
