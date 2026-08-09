# STITCH — Monsoon Edit Storefront

Implementation of the [Figma Make STITCH design](https://people-patio-01007054.figma.site/) as a full-stack web app:

- **Frontend:** React (Vite)
- **Middleware:** FastAPI
- **Database:** MySQL

## Project structure

```
frontend/          React storefront (STITCH)
backend/           FastAPI API + SQLAlchemy models
docker-compose.yml Optional full-stack containers
```

## Features

- Dark editorial storefront matching the Figma composition (marquee, hero, categories, Drop 004, trending rail, philosophy, newsletter, footer)
- Product catalog, categories, and announcements served from MySQL
- Newsletter subscribe endpoint
- Cart drawer with checkout preview against the API
- Seeded Drop 004 / Monsoon Edit catalog on first API boot

## Quick start (local)

### 1. MySQL

```bash
# Create DB + user (once)
sudo mysql -e "
CREATE DATABASE IF NOT EXISTS stitch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'stitch'@'localhost' IDENTIFIED BY 'stitchpass';
GRANT ALL PRIVILEGES ON stitch.* TO 'stitch'@'localhost';
FLUSH PRIVILEGES;"
```

Or with Docker:

```bash
docker compose up -d mysql
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Storefront: [http://localhost:5173](http://localhost:5173)

`frontend/.env` points at `http://localhost:8000/api` by default.

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/announcements` | Marquee messages |
| GET | `/api/categories` | Shop-by-category tiles |
| GET | `/api/products/drop` | Drop 004 products |
| GET | `/api/products/trending` | Trending rail |
| GET | `/api/products` | Filterable catalog |
| POST | `/api/newsletter/subscribe` | Join drop alerts |
| POST | `/api/checkout` | Place an order from the bag |

## Docker (optional)

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- MySQL: `localhost:3306` (`stitch` / `stitchpass`)
