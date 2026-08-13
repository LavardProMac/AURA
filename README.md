# AURA Backend

Node.js + Express + MySQL backend for AURA.

## Local setup

1. Install Node.js.
2. Open MySQL Workbench and run `schema.sql`.
3. Copy `.env.example` to `.env`.
4. Put your MySQL password in `.env`.
5. Run:

```bash
npm install
npm start
```

API:
- `GET /`
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`

The `.env` file must never be committed to GitHub.
