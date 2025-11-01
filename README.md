# RUMI Driving School landing page

This project contains a production-ready React landing page for **РУМИ · Автошкола**.
It is powered by [Vite](https://vitejs.dev/) and [Tailwind CSS](https://tailwindcss.com/).

## Getting started

```bash
npm install
npm run dev
```

The site will be available at http://localhost:5173/.

## Production build

```bash
npm run build
npm run preview
```

The build output lives in `dist/` and can be deployed on any static hosting provider.

## Environment configuration

The contact form uses an SMTP transport. Copy `.env.example` to `.env.local` and fill in your real credentials:

```ini
SMTP_HOST=mail.karailesno.bg
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@karailesno.bg
SMTP_PASS=********
```

> Replace the example values with the actual credentials provided by your email provider. Optionally override `CONTACT_TO_EMAIL` if the default inbox should change.

### Netlify deployment

When deploying on Netlify, configure the same variables in **Site settings → Environment variables**:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- (optional) `CONTACT_TO_EMAIL`

Re-deploy the site after saving the new variables so that the serverless function receives the updated configuration.

## Tech stack

- React 18 with TypeScript
- Vite for bundling and dev server
- Tailwind CSS for styling
- Framer Motion & lucide-react for animation and icons
