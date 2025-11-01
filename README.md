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

The contact form uses an SMTP transport. Copy `.env.example` to `.env.local` and fill in your real credentials (enter the raw values without wrapping them in quotes):

```ini
SMTP_HOST=mail.karailesno.bg
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@karailesno.bg
SMTP_PASS=********
# Optionally enable a JSON transport for local smoke tests
# SMTP_TRANSPORT=json
# Optionally override the primary recipients (comma/semicolon/newline separated)
# CONTACT_TO_EMAIL=office@karailesno.bg,second@example.com
```

> Replace the example values with the actual credentials provided by your email provider. Set `CONTACT_TO_EMAIL` if you need to deliver the form submission to different inboxes—the value can contain multiple addresses separated by commas, semicolons, or newlines. The authenticated SMTP user automatically receives a blind-copy of each message so that you can confirm deliveries from the sender’s mailbox.

When developing locally without access to the production SMTP server you can simulate a delivery with Nodemailer's JSON transport by setting `SMTP_TRANSPORT=json` and running:

```bash
npx ts-node --esm tests/send-email.test.ts
```

The script exercises the Netlify function end-to-end and prints the generated message ID.

### Netlify deployment

When deploying on Netlify, configure the same variables in **Site settings → Environment variables** (again, enter the values without quotes):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- (optional) `CONTACT_TO_EMAIL`

After deployment, the SMTP user (for example `websitenotification@karailesno.bg`) will receive a blind-copy of each submission. This is useful for monitoring the outbox of the sending account while the primary inbox (default `office@karailesno.bg`) receives the actual inquiry.

Re-deploy the site after saving the new variables so that the serverless function receives the updated configuration.

## Tech stack

- React 18 with TypeScript
- Vite for bundling and dev server
- Tailwind CSS for styling
- Framer Motion & lucide-react for animation and icons
