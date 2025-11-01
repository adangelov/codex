import nodemailer from 'nodemailer';

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
  note?: string | null;
  startDate?: string | null;
  lang?: string;
};

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const normalizeEnvValue = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const CONTACT_EMAIL = normalizeEnvValue(process.env.CONTACT_TO_EMAIL) ?? 'office@karailesno.bg';

const smtpHost = normalizeEnvValue(process.env.SMTP_HOST);
const smtpPortRaw = normalizeEnvValue(process.env.SMTP_PORT);
const smtpSecureRaw = normalizeEnvValue(process.env.SMTP_SECURE);
const smtpUser = normalizeEnvValue(process.env.SMTP_USER);
const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);

const parseSecureFlag = (value: string | undefined): boolean | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'n', 'off'].includes(normalized)) {
    return false;
  }

  return undefined;
};

const parsedPort = smtpPortRaw ? Number.parseInt(smtpPortRaw, 10) : undefined;
const smtpPort = Number.isNaN(parsedPort) ? undefined : parsedPort;
const smtpSecure = parseSecureFlag(smtpSecureRaw);

const transporter: nodemailer.Transporter | null =
  smtpHost && smtpPort && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: typeof smtpSecure === 'boolean' ? smtpSecure : smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      })
    : null;

const jsonResponse = (statusCode: number, payload: Record<string, unknown>): NetlifyResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  },
  body: JSON.stringify(payload)
});

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderEmailHtml = (
  payload: Required<Omit<ContactPayload, 'note'>> & { note?: string | null }
): string => {
  const { name, phone, email, course, startDate, lang, note } = payload;
  const startLabel = startDate ? new Date(startDate).toLocaleDateString(lang || 'bg', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : 'Не е избрана дата';
  const trimmedNote = note?.trim() ?? '';
  const formattedNote = trimmedNote ? escapeHtml(trimmedNote).replace(/\n/g, '<br />') : 'Няма допълнителна забележка';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Ново запитване за курс (${course})</h2>
      <p><strong>Име:</strong> ${name}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Предпочитана дата:</strong> ${startLabel}</p>
      <p><strong>Забележка:</strong> ${formattedNote}</p>
      <p>Изпратено чрез уеб сайта.</p>
    </div>
  `;
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!transporter) {
    console.error('Email service missing configuration', {
      hasHost: Boolean(smtpHost),
      hasPort: Boolean(smtpPort),
      hasUser: Boolean(smtpUser),
      hasPass: Boolean(smtpPass)
    });
    return jsonResponse(500, { error: 'Email service is not configured' });
  }

  if (!event.body) {
    return jsonResponse(400, { error: 'Missing request body' });
  }

  let payload: ContactPayload;
  try {
    payload = JSON.parse(event.body) as ContactPayload;
  } catch (error) {
    console.error('Invalid JSON body', error);
    return jsonResponse(400, { error: 'Invalid JSON payload' });
  }

  const { name, phone, email, course, startDate, lang, note } = payload;

  if (!name || !phone || !email || !course) {
    return jsonResponse(400, { error: 'Missing required fields' });
  }

  try {
    const normalizedPayload = {
      name,
      phone,
      email,
      course,
      startDate: startDate ?? null,
      lang: lang ?? 'bg',
      note: note ?? ''
    } as const;

    const html = renderEmailHtml(normalizedPayload);

    const startLabel = normalizedPayload.startDate
      ? new Date(normalizedPayload.startDate).toLocaleDateString(normalizedPayload.lang || 'bg', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      : 'Не е избрана дата';
    const trimmedNote = normalizedPayload.note.trim();

    const text = `Ново запитване за курс (${normalizedPayload.course})\n` +
      `Име: ${normalizedPayload.name}\n` +
      `Телефон: ${normalizedPayload.phone}\n` +
      `Email: ${normalizedPayload.email}\n` +
      `Предпочитана дата: ${startLabel}\n` +
      `Забележка: ${trimmedNote || 'Няма допълнителна забележка'}\n` +
      'Изпратено чрез уеб сайта.';

    await transporter.sendMail({
      from: {
        name: 'РУМИ Автошкола',
        address: smtpUser
      },
      to: CONTACT_EMAIL,
      replyTo: {
        name: normalizedPayload.name,
        address: email
      },
      subject: `Ново запитване за курс (${normalizedPayload.course})`,
      html,
      text
    });
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error('Failed to send email', error);
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return jsonResponse(500, { error: message });
  }
};

export default handler;
