# Brooklyn LMS Platform

This repo hosts the Brooklyn LMS landing page builder/runtime (Next.js + API) and the student portal (User Page).

## Apps
- `apps/api` Express + Mongoose API
- `apps/web` Next.js runtime + admin builder + portal host at `/portal`
- `apps/user-page` Angular student portal source

## Quick start (Docker)
1) Copy envs:
```
cp .env.example .env
```
2) Start services:
```
docker compose up --build
```
3) Seed demo tenant and default landing:
```
docker compose exec api node dist/seed.js
```

Service URLs:
- Runtime: `http://localhost:3001/arkon/home`
- Builder: `http://localhost:3001/admin/hero/editor`
- Leads: `http://localhost:3001/admin/leads`
- Audit: `http://localhost:3001/admin/history`
- API: `http://localhost:3000`
- MinIO: `http://localhost:9001` (console)
- Portal: `http://localhost:3001/portal/login`

## Local dev (without Docker)
- API: `npm --workspace apps/api run dev`
- Web: `npm --workspace apps/web run dev`
- Seed: `npm --workspace apps/api run seed`

## Environment variables
See `.env.example` for full list.
- `MONGODB_URI` Mongo connection string
- `MINIO_ENDPOINT` MinIO S3 endpoint
- `MINIO_PUBLIC_URL` Public base URL for serving assets (defaults to `MINIO_ENDPOINT`)
- `MINIO_BUCKET` Bucket name (default `brooklyn-lms`)
- `PUBLIC_BASE_URL` Base URL for invite links (e.g. `http://localhost:3001`)
- `USER_PAGE_BASE_URL` Redirect target after successful registration (must be a URL)
- `AUTH_API_BASE_URL` Base URL for external `/auth/register`

## Core flows (landing + builder)
1) Admin edits landing at `/admin/hero/editor` and saves.
2) Publish to make it live at `/{tenant}/{slug}`.
3) Submit lead in the Apply section.
4) Approve lead in `/admin/leads` to get invite link.
5) Open invite link and submit registration.
6) Successful registration redirects to `USER_PAGE_BASE_URL`.

## Student portal (User Page)
The portal is an Angular app hosted under `/portal` by the Next.js app. Source lives in `apps/user-page`.

### Identity API integration (portal)
- API wrapper: `apps/user-page/src/shared/api/identity.api.ts`
- Auth session storage: `apps/user-page/src/shared/api/auth-session.service.ts`
- Base URL obfuscation: `apps/user-page/src/shared/api/identity-base-url.ts`
- Route path obfuscation: `apps/user-page/src/shared/api/identity-routes.ts`
- Auth header injection: `apps/user-page/src/shared/api/auth.interceptor.ts`

### Domain (company) flow
- Public route: `/domen` (company domain entry before login).
- Stored in `localStorage` under `user-page.domain.v1`.
- Displayed on the login screen as the selected company portal.
- Auto-detected from the current host if it ends with `.tlms.com`.
- Change the suffix in `apps/user-page/src/features/domain/model/domain.store.ts` (`DOMAIN_SUFFIX`).

### Auth and session rules
- Login uses password flow and expects `access_token` (plus optional `token_type`, `expires_in`, `expires_at`).
- If expiry is not provided by the API, the client defaults to 30 days.
- Session is stored in `localStorage` under `user-page.session.v1`.
- Self-registration is disabled in the UI; users are provisioned by admin portal.
- Test account button reads credentials from `apps/user-page/src/pages/login/ui/login.page.ts` (`TEST_ACCOUNT`).

### Testing login
- The login endpoint only accepts `POST`. Opening the URL in a browser sends `GET` and returns "Method Not Allowed".
- Example (PowerShell):
  ```powershell
  $body = @{ email = "test@test.com"; password = "test" } | ConvertTo-Json
  Invoke-WebRequest -Method Post `
    -Uri "http://99.110.149.130/identity/auth/auth/login" `
    -ContentType "application/json" `
    -Body $body
  ```

## API endpoints
Public:
- `GET  /public/landing/:tenant/:slug`
- `POST /public/leads`
- `GET  /public/invite/validate?token=...`

Admin (protected):
- `GET   /admin/tenant`
- `PATCH /admin/tenant`
- `GET   /admin/landing/:slug`
- `PATCH /admin/landing/:slug`
- `POST  /admin/landing/:slug/publish`
- `GET   /admin/audit?slug=home`
- `GET   /admin/leads?status=PENDING`
- `POST  /admin/leads/:id/accept`
- `POST  /admin/leads/:id/decline`
- `POST  /admin/assets/presign-upload`

## Notes
- Default landing template is original copy and layout with a premium rhythm inspired by School of Motion, without copying any assets.
- All landing configs live in MongoDB; images live in MinIO and are referenced by URL.
- Tenant isolation uses JWT when available; for local dev you can pass `x-tenant-id`, `x-user-id`, and `x-user-email` headers.
