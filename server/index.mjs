import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const boolFromEnv = (value, fallback) => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const requiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
};

const smtpTransportMode = process.env.SMTP_TRANSPORT?.toLowerCase() ?? 'smtp';
const smtpHost = process.env.SMTP_HOST ?? 'localhost';
const smtpPort = Number.parseInt(process.env.SMTP_PORT ?? '465', 10);
const smtpSecure = boolFromEnv(process.env.SMTP_SECURE, smtpPort === 465);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const contactRecipient = requiredEnv('CONTACT_RECIPIENT');
const corsOrigins = process.env.CONTACT_ALLOWED_ORIGINS;
const senderEmail = process.env.CONTACT_SENDER ?? smtpUser ?? 'no-reply@localhost';

const transportOptions = (() => {
  if (smtpTransportMode === 'json') {
    console.log('Using Nodemailer JSON transport (emails will be logged, not sent).');
    return { jsonTransport: true }; // Useful for local development without SMTP access
  }

  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER and SMTP_PASS must be configured unless SMTP_TRANSPORT=json.');
  }

  return {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    logger: true,
    debug: boolFromEnv(process.env.SMTP_DEBUG, true),
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  };
})();

const transporter = nodemailer.createTransport(transportOptions);

console.log('Contact service configuration', {
  transport: transportOptions.jsonTransport ? 'json' : 'smtp',
  host: transportOptions.host ?? null,
  port: transportOptions.port ?? null,
  secure: transportOptions.secure ?? null,
  recipient: contactRecipient,
  allowedOrigins: corsOrigins ?? '*'
});

const smtpStatus = {
  lastCheckedAt: null,
  verified: false,
  error: null
};

const lastSendStatus = {
  lastAttemptAt: null,
  ok: null,
  error: null
};

if (!transportOptions.jsonTransport) {
  transporter
    .verify()
    .then(() => {
      smtpStatus.lastCheckedAt = new Date().toISOString();
      smtpStatus.verified = true;
      smtpStatus.error = null;
      console.log('SMTP transport ready');
    })
    .catch((error) => {
      smtpStatus.lastCheckedAt = new Date().toISOString();
      smtpStatus.verified = false;
      smtpStatus.error = {
        message: error?.message,
        code: error?.code,
        command: error?.command,
        responseCode: error?.responseCode
      };
      console.error('SMTP verification failed', error);
      console.error('SMTP verification error details', {
        code: error?.code,
        command: error?.command,
        responseCode: error?.responseCode,
        response: error?.response,
        stack: error?.stack
      });
    });
} else {
  smtpStatus.lastCheckedAt = new Date().toISOString();
  smtpStatus.verified = true;
  smtpStatus.error = null;
}

const app = express();

let configuredOrigins = null;
if (corsOrigins) {
  const origins = corsOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  configuredOrigins = origins;
  app.use(
    cors({
      origin: origins,
      methods: ['POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type']
    })
  );
} else {
  app.use(cors());
}

app.use(express.json());

function sanitize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isValidEmail(value) {
  return /.+@.+\..+/.test(value);
}

function isValidPhone(value) {
  return /[0-9+()\-\s]{5,}/.test(value);
}

app.use('/api/contact', (req, res, next) => {
  console.log('Incoming contact API request', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    referer: req.headers.referer
  });
  next();
});

app.post('/api/contact', async (req, res) => {
  const name = sanitize(req.body?.name);
  const phone = sanitize(req.body?.phone);
  const email = sanitize(req.body?.email);
  const course = sanitize(req.body?.course);
  const startDate = sanitize(req.body?.startDate);
  const gdpr = Boolean(req.body?.gdpr);

  const errors = [];
  if (!name) errors.push('name');
  if (!phone || !isValidPhone(phone)) errors.push('phone');
  if (!email || !isValidEmail(email)) errors.push('email');
  if (!course) errors.push('course');
  if (!startDate) errors.push('startDate');
  if (!gdpr) errors.push('gdpr');

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid form submission', errors });
  }

  const safeStartDate = new Date(startDate);
  const startDateLabel = Number.isNaN(safeStartDate.getTime())
    ? startDate
    : safeStartDate.toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      });

  const escapedName = escapeHtml(name);
  const escapedPhone = escapeHtml(phone);
  const escapedEmail = escapeHtml(email);
  const escapedCourse = escapeHtml(course);
  const escapedStartDate = escapeHtml(startDateLabel);

  const plainText = `Нова заявка от сайта:\n\nИме: ${name}\nТелефон: ${phone}\nИмейл: ${email}\nКурс: ${course}\nПредпочитана начална дата: ${startDateLabel}\nGDPR съгласие: ${gdpr ? 'да' : 'не'}`;

  const htmlContent = `
    <h2>Нова заявка от сайта</h2>
    <p><strong>Име:</strong> ${escapedName}</p>
    <p><strong>Телефон:</strong> ${escapedPhone}</p>
    <p><strong>Имейл:</strong> ${escapedEmail}</p>
    <p><strong>Курс:</strong> ${escapedCourse}</p>
    <p><strong>Предпочитана начална дата:</strong> ${escapedStartDate}</p>
    <p><strong>GDPR съгласие:</strong> ${gdpr ? 'да' : 'не'}</p>
  `;

  console.log('Sanitized contact submission', {
    name,
    phone,
    email,
    course,
    startDate: startDateLabel,
    gdpr
  });

  try {
    const mailInfo = await transporter.sendMail({
      from: `Website Notification <${senderEmail}>`,
      to: contactRecipient,
      replyTo: email,
      subject: 'Записване през уебсайта',
      text: plainText,
      html: htmlContent
    });
    if (transportOptions.jsonTransport) {
      console.log('Contact email captured by JSON transport', mailInfo?.message);
    }
    lastSendStatus.lastAttemptAt = new Date().toISOString();
    lastSendStatus.ok = true;
    lastSendStatus.error = null;
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    lastSendStatus.lastAttemptAt = new Date().toISOString();
    lastSendStatus.ok = false;
    lastSendStatus.error = {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode
    };
    console.error('Failed to send contact email', error);
    console.error('Contact email error details', {
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      response: error?.response,
      stack: error?.stack
    });
    return res.status(500).json({ message: 'Failed to send email' });
  }
});

app.get('/api/contact/health', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    smtp: smtpStatus,
    lastSend: lastSendStatus,
    transport: transportOptions.jsonTransport ? 'json' : 'smtp',
    allowedOrigins: configuredOrigins ?? '*'
  });
});

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
app.listen(port, () => {
  console.log(`Contact API listening on port ${port}`);
});
