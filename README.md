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

1. Copy `.env.example` to `.env` and fill in `SMTP_PASS` with the mailbox password.
2. In one terminal start the mail service:

   ```bash
   npm run server
   ```

   It reads the SMTP configuration from `.env` and listens on port `3000`.
3. In a separate terminal run the Vite dev server (`npm run dev`). The frontend will send
   requests to `VITE_CONTACT_ENDPOINT` (defaults to `http://localhost:3000/api/contact`).

For production deployments, expose the server under the same domain as the site or update
`VITE_CONTACT_ENDPOINT` to point to the deployed API. Adjust `CONTACT_ALLOWED_ORIGINS`
with a comma-separated list of origins that are allowed to call the endpoint.

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
