# Portfolio (React + 3D + Contact API)

Interactive developer portfolio with:

- a React + Vite frontend,
- WebGL/Three.js sections via React Three Fiber,
- a PostgreSQL-backed contact workflow (local Express + production serverless API),
- a featured Projects section with live demo links,
- a dedicated Resume section with View/Download actions,
- and a Get Emailed flow to send the resume directly to a visitor's email.

---

## Tech Stack (Detailed)

### 1) Frontend Application Layer

- **React 19**: component-driven UI, stateful interactions, section navigation, and conditional rendering.
- **Vite 7**: fast development server + production bundling.
- **GSAP**: scroll reveal, motion polish, and interaction transitions.
- **Vercel Analytics**: lightweight page analytics for production usage insights.

Why this matters:

- React keeps page sections modular and maintainable.
- Vite keeps local iteration fast.
- GSAP provides smooth animation without heavy custom animation code.
- Vercel Analytics provides deployment-native traffic visibility.

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

Recent UX updates:

- Projects cards include clickable preview images and "View Live" CTA.
- Resume section includes "View" and "Download" buttons.
- Resume section also supports "Get Emailed" with email input + submit.
- On mobile, the solar system panel appears before the contact form for better flow.
- On mobile, holding anywhere on a skill model canvas activates hold interaction for all models in that card.

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
- Contact submissions now also trigger an automated acknowledgement email to the sender.
- Both acknowledgement and Get Emailed flows can attach resume PDF using `RESUME_PDF_URL`.

### 7) Production API Path

- **Vercel serverless function** at `api/contact.js`.
- Mirrors local contact API behavior so deployed frontend can submit directly.
- Additional serverless route at `api/resume-email.js` for resume delivery emails.

---

## Project Structure (Key Files)

- `src/App.jsx` → main page layout, sections, interactions.
- `src/App.css` → global styling and responsive behavior.
- `src/main.jsx` → app bootstrap and Vercel Analytics mount.
- `src/components/Model.jsx` → hero model loading/animation switching.
- `src/components/NameModel.jsx` → interactive 3D name behavior.
- `src/components/ResonanceOrrery.jsx` → embedded 3D resonance card.
- `src/assets/cal.png` → calculator project preview image.
- `src/assets/todo.png` → todo app project preview image.
- `server/index.js` → local Express contact API.
- `api/contact.js` → production serverless contact API.
- `api/resume-email.js` → production serverless resume email API.
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
- `RESUME_PDF_URL` (public direct PDF URL for email attachment source)

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
- sends email notification to you if SMTP is configured,
- sends an automated reply to the sender with brief intro + 48 business-hours response note,
- attaches your resume PDF in the auto-reply (using `RESUME_PDF_URL` or fallback URL).

---

## Resume Email API Contract

### Endpoint

- `POST /api/resume-email`

### Request Body

```json
{
  "email": "name@company.com"
}
```

### Behavior

- validates email input,
- sends resume email using existing SMTP configuration,
- attaches resume PDF (`RESUME_PDF_URL` or fallback URL) and includes backup link,
- returns success/error status for frontend feedback.

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
