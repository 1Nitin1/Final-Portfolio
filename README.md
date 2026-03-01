# Portfolio App

This project uses a Vite React frontend and an Express + PostgreSQL backend for contact form submissions.

## Prerequisites

- Node.js 18+
- PostgreSQL running locally on port 5432
- `contacts` table created in `contactdb`

## Environment setup

1. Copy `.env.example` to `.env`.
2. Fill your PostgreSQL values.

You can use either:

- `DATABASE_URL=postgresql://...`
- or separate fields (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

For contact email notifications (Nodemailer), also configure:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `MAIL_TO` (default recipient can be `nitinkumarbaranawal@gmail.com`)

For Gmail SMTP, use:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=<your-gmail>`
- `SMTP_PASS=<your-gmail-app-password>`

## Run locally

Frontend (Vite):

```bash
npm run dev
```

Backend (Express API):

```bash
npm run server
```

Vite proxies `/api/*` to `http://localhost:3001` in development.

## API endpoint

- `POST /api/contact`
  - body: `{ "name": "...", "email": "...", "message": "..." }`
  - stores to `contacts(name, email, message, ip_address, user_agent)`
  - sends formatted email notification via Nodemailer when SMTP env vars are configured
