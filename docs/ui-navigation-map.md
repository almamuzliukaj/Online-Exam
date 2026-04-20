# UI Navigation Map

## Global Entry

- `/login`
  - Public login page
  - Demo role presets
  - Redirects users to their role landing route after authentication

## Role Landing Routes

- `Admin -> /admin/users`
- `Professor -> /exams`
- `Assistant -> /exams`
- `Student -> /dashboard`

## Shared Protected Routes

- `/dashboard`
  - Shared dashboard route
  - Content changes by role
  - Uses the common app shell

## Admin Navigation

Sidebar items:

- `/dashboard`
- `/admin/users`
- `/admin/courses`
- `/admin/offerings`

Visible purpose:

- operational overview
- account governance
- academic catalog
- course offering setup

Not visible to admin:

- exam workspace navigation
- exam authoring navigation
- question authoring navigation

## Professor Navigation

Sidebar items:

- `/dashboard`
- `/exams`
- `/exams/new`

Flow:

1. Login
2. Redirect to `/exams`
3. Review owned exam workspaces
4. Create a new exam
5. Open exam detail
6. Add question

## Assistant Navigation

Sidebar items:

- `/dashboard`
- `/exams`

Flow:

1. Login
2. Redirect to `/exams`
3. Review assigned exam workspaces
4. Open exam detail

Current boundary:

- assistant does not receive question-authoring route entry in the shell

## Student Navigation

Sidebar items:

- `/dashboard`
- `/exams`

Flow:

1. Login
2. Redirect to `/dashboard`
3. Review eligibility-focused dashboard
4. Open visible exams list

## Route Guard Map

### Public

- `/login`

### Authenticated

- `/dashboard`

### Admin only

- `/admin/users`
- `/admin/courses`
- `/admin/offerings`

### Professor, Assistant, Student

- `/exams`
- `/exams/:examId`

### Professor, Assistant

- `/exams/new`

### Professor only

- `/exams/:examId/questions/new`

## UX Goals of the Map

- each role sees a short, understandable menu
- cross-role routes are hidden before the user tries to open them
- admin navigation stays operational rather than academic-content focused
- the shell remains reusable while the visible workspace changes per role
