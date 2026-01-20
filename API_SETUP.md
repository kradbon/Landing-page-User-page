# API Setup and Login Flow

This file documents the current login API wiring and dev proxy setup.

## Login request (HTTP)

URL pattern:

```
http://<company-domain>/api/login
```

Example:

```
http://acme.localhost:8000/api/login
```

Method and headers:

```
POST /api/login
Content-Type: application/json
```

Body:

```json
{
  "email": "user@company.com",
  "password": "plain_password"
}
```

The frontend automatically includes `X-Company-Domain` from localStorage when present.

## Expected response

The client expects JSON with an `access_token` string. Optional fields supported:

```json
{
  "access_token": "token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "expires_at": 1700000000,
  "refresh_token": "token"
}
```

If the response shape differs, update:

- `src/shared/api/identity.types.ts`
- `src/features/auth/model/auth.store.ts`

## Frontend wiring

- Login call: `src/shared/api/identity.api.ts` -> `login()`
- Login route: `src/shared/api/identity-routes.ts` -> `/api/login`
- Session storage: `src/shared/api/auth-session.service.ts`
- Company domain storage key: `user-page.domain.v1`
- Domain entry page: `/domen`

Requests use the domain base URL when a company domain is set. If no domain is set,
relative paths are used (for the proxy).

## Dev proxy (CORS workaround)

Proxy config: `proxy.conf.js`

Default target:

```
http://99.110.149.130/identity
```

Override target:

CMD:

```
set API_TARGET=http://<host>:<port>
ng serve
```

PowerShell:

```
$env:API_TARGET="http://<host>:<port>"
ng serve
```

Routing behavior:

- If the saved company domain includes a dot or port, the proxy routes directly to it.
- Otherwise, it uses `API_TARGET`.

## Troubleshooting

- CORS errors: ensure the request URL is `http://localhost:4200/api/login`.
- HTML response: target is pointing at a landing page, not the API.
- 500 with empty body: backend error; check server logs or direct curl test.

## Notes

- When running on `localhost`, the domain suffix defaults to `localhost:8000` in
  `src/features/domain/model/domain.store.ts`.
