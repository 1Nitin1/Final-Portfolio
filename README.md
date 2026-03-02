# Portfolio (React + 3D + Contact API)

Interactive developer portfolio with:

- a React + Vite frontend,
- WebGL/Three.js sections via React Three Fiber,
- and a PostgreSQL-backed contact workflow (local Express + production serverless API).

---

## Tech Stack (Detailed)

### 1) Frontend Application Layer

- **React 19**: component-driven UI, stateful interactions, section navigation, and conditional rendering.
- **Vite 7**: fast development server + production bundling.
- **GSAP**: scroll reveal, motion polish, and interaction transitions.

Why this matters:

- React keeps page sections modular and maintainable.
- Vite keeps local iteration fast.
- GSAP provides smooth animation without heavy custom animation code.

### 2) 3D / WebGL Layer

- **three**: core 3D rendering engine.
- **@react-three/fiber**: React renderer for Three.js scenes.
- **@react-three/drei**: helpers for loaders, controls, and animation tooling.

Current 3D usage includes:

- character/model rendering,
- GLB logo models in skill cards,
- hover/hold interactions,
- and a separate embedded “resonance” system card.

### 3) Styling / UX Layer

- Custom CSS (`src/App.css`) with responsive breakpoints.
- Contact + skills + model canvases optimized for mobile layout constraints.
- Uses modern gradients, glassmorphism-like cards, and adaptive card stacking.

### 4) Contact API (Local Dev)

- **Express 5** (`server/index.js`) for local API routing.
- **cors** for controlled cross-origin requests.
- **express-rate-limit** to protect contact endpoint from abuse.
- Request validation (length checks + email pattern checks).

### 5) Database Layer

- **PostgreSQL** via **pg** (`Pool`) for persistent contact submissions.
- Supports both:
  - single `DATABASE_URL`, or
  - separate `DB_*` environment fields.

Stored fields:

- `name`, `email`, `message`, `ip_address`, `user_agent`, and timestamp (`created_at` in DB schema).

### 6) Email Notification Layer

- **nodemailer** for contact submission notifications.
- SMTP-driven setup (`SMTP_*`, `MAIL_FROM`, `MAIL_TO`).
- If SMTP is not configured, submissions are still saved to DB.

### 7) Production API Path

- **Vercel serverless function** at `api/contact.js`.
- Mirrors local contact API behavior so deployed frontend can submit directly.

---

## Project Structure (Key Files)

- `src/App.jsx` → main page layout, sections, interactions.
- `src/App.css` → global styling and responsive behavior.
- `src/components/Model.jsx` → hero model loading/animation switching.
- `src/components/NameModel.jsx` → interactive 3D name behavior.
- `src/components/ResonanceOrrery.jsx` → embedded 3D resonance card.
- `server/index.js` → local Express contact API.
- `api/contact.js` → production serverless contact API.
- `vite.config.js` → dev proxy for `/api`.
- `.env.example` → environment variable template.

---

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

---

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Fill `.env` values.

---

## Environment Variables

### Core API

- `PORT` (default `3001`)
- `CLIENT_ORIGIN` (for CORS, e.g. `http://localhost:5173`)

### Database

Use either:

- `DATABASE_URL`, or
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`

### Email (optional but recommended)

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM`, `MAIL_TO`

Gmail example:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`

---

## Run Locally

Start frontend:

```bash
npm run dev
```

Start backend API (new terminal):

```bash
npm run server
```

Dev proxy behavior:

- Frontend calls to `/api/*` are proxied to `http://localhost:3001`.

---

## Contact API Contract

### Endpoint

- `POST /api/contact`

### Request Body

```json
{
  "name": "Your Name",
  "email": "name@company.com",
  "message": "Opportunity details"
}
```

### Behavior

- validates request,
- writes to PostgreSQL,
- sends email notification if SMTP is configured.

---

## Deployment Notes

- Set all required environment variables in your deployment platform.
- For serverless deployment, `api/contact.js` is the production API entry.
- If using managed PostgreSQL (e.g., Neon), set `DB_SSL=true` when needed.

---

## Scripts

- `npm run dev` → start Vite dev server
- `npm run server` → start local Express API
- `npm run build` → production build
- `npm run preview` → preview production build
- `npm run lint` → lint checks
