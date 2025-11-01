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

declare global {
  // eslint-disable-next-line no-var
  var __CONTACT_FORM_TRANSPORT__: nodemailer.Transporter | null | undefined;
}

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

type TransportMode = 'smtp' | 'json' | 'stream';

type TransportConfig = {
  mode: TransportMode;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
};

const readTransportConfig = (): TransportConfig => {
  const transportOverride = normalizeEnvValue(process.env.SMTP_TRANSPORT)?.toLowerCase();
  const mode: TransportMode = transportOverride === 'json' || transportOverride === 'stream' ? transportOverride : 'smtp';

  const smtpHost = normalizeEnvValue(process.env.SMTP_HOST);
  const smtpPortRaw = normalizeEnvValue(process.env.SMTP_PORT);
  const parsedPort = smtpPortRaw ? Number.parseInt(smtpPortRaw, 10) : undefined;
  const smtpPort = Number.isNaN(parsedPort) ? undefined : parsedPort;
  const smtpSecureRaw = normalizeEnvValue(process.env.SMTP_SECURE);
  const smtpSecure = parseSecureFlag(smtpSecureRaw);
  const smtpUser = normalizeEnvValue(process.env.SMTP_USER);
  const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);

  return {
    mode,
    host: smtpHost,
    port: smtpPort,
    secure: typeof smtpSecure === 'boolean' ? smtpSecure : undefined,
    user: smtpUser,
    pass: smtpPass
  };
};

const createTransporterFromConfig = (config: TransportConfig): nodemailer.Transporter | null => {
  if (config.mode === 'json') {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  if (config.mode === 'stream') {
    return nodemailer.createTransport({ streamTransport: true, buffer: true });
  }

  if (!config.host || !config.port || !config.user || !config.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: typeof config.secure === 'boolean' ? config.secure : config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
};

let cachedTransporter: nodemailer.Transporter | null | undefined;
let cachedConfig: TransportConfig | null = null;

const getTransporter = (): nodemailer.Transporter | null => {
  if (typeof globalThis.__CONTACT_FORM_TRANSPORT__ !== 'undefined') {
    return globalThis.__CONTACT_FORM_TRANSPORT__;
  }

  if (typeof cachedTransporter !== 'undefined') {
    return cachedTransporter;
  }

  cachedConfig = readTransportConfig();
  cachedTransporter = createTransporterFromConfig(cachedConfig);
  return cachedTransporter;
};

const getCachedConfig = (): TransportConfig | null => {
  if (cachedConfig) {
    return cachedConfig;
  }
  cachedConfig = readTransportConfig();
  return cachedConfig;
};

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

const getPreferredDateLabel = (startDate: string | null | undefined, locale: string): string => {
  if (!startDate) {
    return 'Не е избрана дата';
  }

  try {
    const parsed = new Date(startDate);
    if (Number.isNaN(parsed.getTime())) {
      return 'Не е избрана дата';
    }
    return parsed.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Failed to format start date', { error, startDate, locale });
    return 'Не е избрана дата';
  }
};

type NormalizedPayload = {
  name: string;
  phone: string;
  email: string;
  course: string;
  note: string;
  startDate: string | null;
  lang: string;
};

const renderEmailHtml = (payload: NormalizedPayload): string => {
  const { name, phone, email, course, startDate, lang, note } = payload;
  const startLabel = getPreferredDateLabel(startDate ?? null, lang || 'bg');
  const trimmedNote = note.trim();
  const formattedNote = trimmedNote ? escapeHtml(trimmedNote).replace(/\n/g, '<br />') : 'Няма допълнителна забележка';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Ново запитване за курс (${escapeHtml(course)})</h2>
      <p><strong>Име:</strong> ${escapeHtml(name)}</p>
      <p><strong>Телефон:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Предпочитана дата:</strong> ${escapeHtml(startLabel)}</p>
      <p><strong>Забележка:</strong> ${formattedNote}</p>
      <p>Изпратено чрез уеб сайта.</p>
    </div>
  `;
};

const normalizePayload = (payload: ContactPayload): NormalizedPayload | null => {
  const requiredFields = ['name', 'phone', 'email', 'course'] as const;
  for (const field of requiredFields) {
    if (!payload[field] || typeof payload[field] !== 'string' || !payload[field]?.trim()) {
      return null;
    }
  }

  const normalizedNote = typeof payload.note === 'string' ? payload.note.trim() : '';
  const normalizedStartDate = typeof payload.startDate === 'string' ? payload.startDate.trim() : null;
  const normalizedLang = typeof payload.lang === 'string' && payload.lang.trim() ? payload.lang.trim() : 'bg';

  return {
    name: payload.name!.trim(),
    phone: payload.phone!.trim(),
    email: payload.email!.trim(),
    course: payload.course!.trim(),
    note: normalizedNote || '',
    startDate: normalizedStartDate || null,
    lang: normalizedLang
  };
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const transporter = getTransporter();
  const transportConfig = getCachedConfig();
  if (!transporter) {
    console.error('Email service missing configuration', {
      mode: transportConfig?.mode,
      hasHost: Boolean(transportConfig?.host),
      hasPort: Boolean(transportConfig?.port),
      hasUser: Boolean(transportConfig?.user),
      hasPass: Boolean(transportConfig?.pass)
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

  const normalizedPayload = normalizePayload(payload);
  if (!normalizedPayload) {
    return jsonResponse(400, { error: 'Missing required fields' });
  }

  try {
    const startLabel = getPreferredDateLabel(normalizedPayload.startDate, normalizedPayload.lang);
    const trimmedNote = normalizedPayload.note.trim();

    const html = renderEmailHtml(normalizedPayload);
    const text = `Ново запитване за курс (${normalizedPayload.course})\n` +
      `Име: ${normalizedPayload.name}\n` +
      `Телефон: ${normalizedPayload.phone}\n` +
      `Email: ${normalizedPayload.email}\n` +
      `Предпочитана дата: ${startLabel}\n` +
      `Забележка: ${trimmedNote || 'Няма допълнителна забележка'}\n` +
      'Изпратено чрез уеб сайта.';

    const fromAddress = transportConfig?.user ?? CONTACT_EMAIL;
    const info = await transporter.sendMail({
      from: {
        name: 'РУМИ Автошкола',
        address: fromAddress
      },
      to: CONTACT_EMAIL,
      replyTo: `${normalizedPayload.name} <${normalizedPayload.email}>`,
      subject: `Ново запитване за курс (${normalizedPayload.course})`,
      html,
      text
    });
    return jsonResponse(200, { ok: true, messageId: info.messageId ?? null });
  } catch (error) {
    console.error('Failed to send email', error);
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return jsonResponse(500, { error: message });
  }
};

export default handler;
