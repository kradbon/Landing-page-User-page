# UserPage

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

## Purpose

This program is the Brooklyn LMS student portal. It exists to:

- Give learners a single place to access courses, lessons, quizzes, tests, downloads, notebook, and AI tutor.
- Support company-specific access via a domain step (`/domen`) so each customer uses `<company>.tlms.com`.
- Integrate with the Identity service for authentication/authorization; users are provisioned by admins.
- Validate the frontend integration with the Identity API while backend services are being finalized.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Identity API integration

This app connects to the Identity service documented at `/identity/docs`. All endpoints listed in the spec are wired in a single API wrapper and use an obfuscated base URL and route paths.

### Where the integration lives

- API wrapper: `src/shared/api/identity.api.ts`
- Auth session storage: `src/shared/api/auth-session.service.ts`
- Base URL obfuscation: `src/shared/api/identity-base-url.ts`
- Route path obfuscation: `src/shared/api/identity-routes.ts`
- Auth header injection: `src/shared/api/auth.interceptor.ts`

### Domain (company) flow

- Public route: `/domen` (company domain entry before login).
- Stored in `localStorage` under `user-page.domain.v1`.
- Displayed on the login screen as the selected company portal.
- Auto-detected from the current host if it ends with `.tlms.com`.
- Change the suffix in `src/features/domain/model/domain.store.ts` (`DOMAIN_SUFFIX`).

### Auth and session rules

- Login uses password flow and expects `access_token` (plus optional `token_type`, `expires_in`, `expires_at`).
- If expiry is not provided by the API, the client defaults to 30 days.
- Session is stored in `localStorage` under `user-page.session.v1`.
- Self-registration is disabled in the UI; users are provisioned by admin portal.
- Test account button reads credentials from `src/pages/login/ui/login.page.ts` (`TEST_ACCOUNT`).

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

### Endpoint coverage

- Auth: `POST /auth/auth/register`, `POST /auth/auth/login`
- Users: `GET/POST /users/users`
- Roles: `GET/POST /roles/roles`, `PATCH/DELETE /roles/roles/{role_id}`, `PUT /roles/roles/{role_id}/permissions`
- Permissions: `GET/POST /permissions/permissions`, `PATCH /permissions/permissions/{permission_id}`
- Health: `GET /health/health`, `GET /health/ready`

### Obfuscation notes

The base URL and route paths are stored as base64 strings of the reversed plaintext. To update:

1. Reverse the new URL or path.
2. Base64 encode the reversed string.
3. Replace the encoded value in `src/shared/api/identity-base-url.ts` or `src/shared/api/identity-routes.ts`.
