# Codex Log (UI Refactor)

This document captures what was changed in this workspace while refactoring the original “admin-style single page” into a **student/user LMS portal** with **FSD structure** and **Tailwind CSS v4**.

## Goals (as requested)

- Replace the previous admin-oriented UI with a **student/user portal** (login + learning pages + profile + change password).
- Rebuild using **FSD (Feature-Sliced Design) folder structure**.
- Use **Tailwind CSS v4** for the UI.
- Match typography better (Inter) and add icons.
- Keep the project runnable and tested.

## High-level result

- App is now a routed SPA with:
  - `login`
  - `dashboard`
  - `courses`
  - `lessons`
  - `quizzes`
  - `tests`
  - `dida`
  - `downloads`
  - `notebook`
  - `ai-tutor`
  - `profile`
  - `security` (change password + sign out)
- State is managed with Angular **signals** in small stores (auth, user, courses, notebook, ai tutor).
- UI uses **Tailwind v4** classes (and small reusable component classes for inputs).

## Tech stack and tooling

- Angular `^21`
- Tailwind CSS `^4.1.18` (via PostCSS)
- PostCSS + Autoprefixer
- Inter font via `@fontsource/inter`
- Unit tests: `ng test` (Vitest-backed builder from Angular tooling)

## Tailwind CSS v4 setup

Added:
- `tailwind.config.js` – content scanning for `./src/**/*.{html,ts}`
- `postcss.config.json` – enables `@tailwindcss/postcss` + `autoprefixer`
- Dev deps in `package.json`:
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `postcss`
  - `autoprefixer`

Important integration detail:
- Global stylesheet was switched to `src/styles.css` (not SCSS) to use Tailwind v4’s `@import 'tailwindcss';`.
- `angular.json` was updated to use `src/styles.css`.

Files:
- `tailwind.config.js`
- `postcss.config.json`
- `angular.json`
- `src/styles.css`

## Typography (Inter)

- Inter is loaded via CSS import:
  - `@import '@fontsource/inter/latin.css';`
- Global font stack is applied via CSS variable `--font-sans` and used for `body`.

File:
- `src/styles.css`

## Icons

- Added a lightweight inline SVG icon component:
  - `src/shared/ui/icon/icon.component.ts`
  - `src/shared/ui/icon/icon.types.ts`
- Wired into:
  - sidebar nav icons
  - header icons (search, chevron)
  - login brand icon

Files:
- `src/shared/ui/icon/icon.component.ts`
- `src/shared/ui/icon/icon.types.ts`
- `src/widgets/layout/ui/app-shell.component.ts`
- `src/pages/login/ui/login.page.ts`

## FSD structure

Created these top-level slices under `src/`:

- `src/app` – app bootstrap, router config, app root component
- `src/pages` – route-level pages
- `src/widgets` – layout shell widget (sidebar + header)
- `src/features` – business features (auth, notebook, ai tutor)
- `src/entities` – domain entities (user, course, download, note)
- `src/shared` – shared UI + utilities

TypeScript path aliases were added:

- `@app/*` → `src/app/*`
- `@pages/*` → `src/pages/*`
- `@widgets/*` → `src/widgets/*`
- `@features/*` → `src/features/*`
- `@entities/*` → `src/entities/*`
- `@shared/*` → `src/shared/*`

File:
- `tsconfig.json`

## Routing and layout

- App now uses `@angular/router` and a route tree.
- Protected routes are guarded and redirect to `/login`.
- Main layout is a “shell” widget with sidebar + header:
  - `AppShellComponent` (`src/widgets/layout/ui/app-shell.component.ts`)

Files:
- `src/app/app.routes.ts`
- `src/app/app.config.ts` (provides router)
- `src/app/app.component.ts`
- `src/app/app.component.html`
- `src/main.ts`
- `src/widgets/layout/ui/app-shell.component.ts`

## Auth (demo)

- `AuthStore` persists `signedIn` state in localStorage key: `user-page.auth.v1`.
- `authGuard` redirects unauthenticated users to `/login`.
- Login page supports “demo sign in” and simple validation.

Files:
- `src/features/auth/model/auth.store.ts`
- `src/features/auth/model/auth.guard.ts`
- `src/pages/login/ui/login.page.ts`

## Domain entities + demo data

### User / Student profile

- `User` + `StudentProfile` types match your schema fields (stored client-side as demo data):
  - `users`: `email`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `phone`, `bio`, `position_title`, `date_of_birth`, `gender`, `language_preference`
  - `student_profiles`: `grade_level`, `enrollment_date`, `parent_contact_json`, `extra_info`
- `UserStore` holds user + student profile and exposes computed `fullName` + `initials`.

Files:
- `src/entities/user/model/types.ts`
- `src/entities/user/model/demo.ts`
- `src/entities/user/model/user.store.ts`

### Courses

- `CourseStore` is signal-based and powers:
  - dashboard stats
  - course cards
  - lessons/quizzes/tests pages
- Demo courses are “marketplace-style” (backend/frontend/etc). The platform can sell any topics.
- Kept the field name as `teacher` (as requested).

Files:
- `src/entities/course/model/types.ts`
- `src/entities/course/model/demo.ts`
- `src/entities/course/model/course.store.ts`

### Downloads

- Demo download list and downloads page.

Files:
- `src/entities/download/model/types.ts`
- `src/entities/download/model/demo.ts`
- `src/pages/downloads/ui/downloads.page.ts`

### Notes (Notebook)

- Notes are stored locally in a Notebook feature store.
- Supports: select note, create, save, delete.

Files:
- `src/entities/note/model/types.ts`
- `src/entities/note/model/demo.ts`
- `src/features/notebook/model/notebook.store.ts`
- `src/pages/notebook/ui/notebook.page.ts`

## AI Tutor (demo)

- A simple chat store that:
  - keeps conversation messages
  - generates a basic reply based on keywords (lesson/quiz/test/dida)
  - optionally prefixes with the current course title

Files:
- `src/features/ai-tutor/model/ai-tutor.store.ts`
- `src/pages/ai-tutor/ui/ai-tutor.page.ts`

## Shared utilities

- `cryptoSafeId()` – stable IDs for demo-created items
- `initials()` – initials from a name
- `stablePercent()` – deterministic demo “scores”

Files:
- `src/shared/lib/crypto-safe-id.ts`
- `src/shared/lib/initials.ts`
- `src/shared/lib/stable-percent.ts`

## Toast notifications

- `ToastService` uses a signal and auto-dismiss timer.
- `ToastComponent` renders it globally in `AppComponent`.

Files:
- `src/shared/ui/toast/toast.service.ts`
- `src/shared/ui/toast/toast.component.ts`
- `src/app/app.component.html`

## Pages implemented (current state)

- `src/pages/login/ui/login.page.ts`
- `src/pages/dashboard/ui/dashboard.page.ts` (fully wired to `CourseStore` stats + continue flow)
- `src/pages/courses/ui/courses.page.ts` (course cards, navigation)
- `src/pages/lessons/ui/lessons.page.ts` (table + completion toggle)
- `src/pages/quizzes/ui/quizzes.page.ts` (table + “Start” submit demo)
- `src/pages/tests/ui/tests.page.ts` (table + submit demo)
- `src/pages/dida/ui/dida.page.ts` (simple info + links)
- `src/pages/downloads/ui/downloads.page.ts` (table + download toast)
- `src/pages/notebook/ui/notebook.page.ts` (note list + editor)
- `src/pages/ai-tutor/ui/ai-tutor.page.ts` (chat UI)
- `src/pages/profile/ui/profile.page.ts` (user + student profile form)
- `src/pages/security/ui/security.page.ts` (change password validation + sign out)

## Removed legacy single-component UI

The previous monolithic admin-like screen lived in:
- `src/app/app.ts`
- `src/app/app.html`
- `src/app/app.scss`

These were removed and replaced by router-based pages + FSD slices.

## Tests

- Updated `src/app/app.spec.ts` to work with routing:
  - verifies app creation
  - renders login page title
  - verifies auth guard redirects `/dashboard` → `/login` when signed out

## How to run

On Windows PowerShell with script execution restrictions, use `npm.cmd`:

- Install: `npm.cmd install`
- Dev server: `npm.cmd start`
- Tests: `npm.cmd test`
- Build: `npm.cmd run build`

## Next steps (when backend is ready)

- Replace demo stores (`*Store`) with API-backed services per microservice.
- Replace localStorage auth with real session/JWT and refresh flow.
- Move demo “teacher” naming and course fields to match actual backend contract.
- Add real icons set (or move to an icon font / sprite) if required.

