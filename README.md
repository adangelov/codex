# RUMI Driving School landing page

This project contains a production-ready React landing page for **РУМИ · Автошкола**.
It is powered by [Vite](https://vitejs.dev/) and [Tailwind CSS](https://tailwindcss.com/).

## Getting started

```bash
npm install
npm run dev
```

The site will be available at http://localhost:5173/.

## Contact email API

The contact form now sends emails through a small Node.js service.

1. Copy `.env.example` to `.env` and fill in the SMTP credentials. Set `SMTP_TRANSPORT=json`
   if you want to capture messages locally without contacting the real mail server.
2. In one terminal start the mail service:

   ```bash
   npm run server
   ```

   It reads the SMTP configuration from `.env` and listens on port `3000`.
   - Use `SMTP_PORT=587` and `SMTP_SECURE=false` if your provider expects STARTTLS
     instead of implicit TLS.
   - Override `CONTACT_SENDER` when your SMTP user differs from the `From` header
     that should appear in outgoing emails.
3. In a separate terminal run the Vite dev server (`npm run dev`). The frontend will send
   requests to `VITE_CONTACT_ENDPOINT` (defaults to `http://localhost:3000/api/contact`).

For production deployments, expose the server under the same domain as the site or update
`VITE_CONTACT_ENDPOINT` to point to the deployed API. Adjust `CONTACT_ALLOWED_ORIGINS`
with a comma-separated list of origins that are allowed to call the endpoint.

### Diagnosing missing submissions

- After the server starts it exposes `GET /api/contact/health`. Open this path in a browser
  (e.g. `https://your-domain.com/api/contact/health`). If you **do not** receive a JSON
  response, your static hosting is not forwarding requests to the Node service yet.
- Successful calls to `/api/contact` are logged as `Sanitized contact submission …`. If the
  health check works but these logs never appear, the frontend is still pointing at the wrong
  endpoint—set `VITE_CONTACT_ENDPOINT` before building the site so it targets the deployed
  API URL.
- The health response also reports the latest SMTP verification status and the timestamp of the
  last send attempt, which helps confirm whether the mail transport is available from the server.

## Production build

```bash
npm run build
npm run preview
```

The build output lives in `dist/` and can be deployed on any static hosting provider.

## Tech stack

- React 18 with TypeScript
- Vite for bundling and dev server
- Tailwind CSS for styling
- Framer Motion & lucide-react for animation and icons
