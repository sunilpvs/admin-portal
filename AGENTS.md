# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
This repository is a **frontend-only** Create React App (CRA, `react-scripts@5`) admin dashboard (`react_dashboard`). There is no backend or database in this repo — the app talks to an **external PHP REST API** (endpoints like `auth/login.php`, `auth/check.php`, `auth/refresh.php`) configured via `REACT_APP_API_BASE_URL` in `.env`. The committed `.env` points at a placeholder (`https://api.local/`), so anything past the login screen (real login, data grids) requires a reachable backend that is not part of this repo.

### Services (single service)
| Task | Command | Notes |
|---|---|---|
| Dev server | `npm start` | CRA dev server on port `3000`. Use `BROWSER=none` to avoid launching a browser. |
| Lint | `npx eslint src --ext .js,.jsx` | CRA also runs eslint during `start`/`build`. Currently ~51 warnings, 0 errors. |
| Test | `npm test` | No test files exist yet; runner reports "No tests found" (exits non-zero). Use `CI=true npm test` for non-interactive. |
| Build | `CI=false npm run build` | `CI=false` is required so lint warnings don't fail the build (matches CI in `.github/workflows/main.yml`). |

### Non-obvious notes
- **Auth flow without a backend:** The app's core auth/routing still works standalone. Visiting any protected route (e.g. `/country`) triggers `ProtectedRoute` → `checkAuth()`; with no backend it fails and redirects to `/login`. Unknown routes render a catch-all 404 page. This is the extent of what can be exercised without the external PHP API.
- **Login is Microsoft SSO:** The login card redirects to `REACT_APP_API_BASE_URL + auth/auth.php?portal=admin`, so end-to-end login needs both the backend and a Microsoft SSO configuration.
- **Node:** CI uses Node 18; the app also builds/runs fine on Node 22 (present in this environment).
- **Env files:** `.env` is committed; `.env.production` is gitignored. `README.md` and `scripts/` are gitignored (so no README is tracked here).
