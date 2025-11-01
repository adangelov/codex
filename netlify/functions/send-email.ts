import { Resend } from 'resend';

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
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

const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'office@karailesno.bg';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

const renderEmailHtml = (payload: Required<ContactPayload>): string => {
  const { name, phone, email, course, startDate, lang } = payload;
  const startLabel = startDate ? new Date(startDate).toLocaleDateString(lang || 'bg', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : 'Не е избрана дата';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Ново запитване за курс (${course})</h2>
      <p><strong>Име:</strong> ${name}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Предпочитана дата:</strong> ${startLabel}</p>
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

  if (!resend || !fromEmail) {
    console.error('Email service missing configuration');
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

  const { name, phone, email, course, startDate, lang } = payload;

  if (!name || !phone || !email || !course) {
    return jsonResponse(400, { error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: CONTACT_EMAIL,
      reply_to: email,
      subject: `Ново запитване за курс (${course})`,
      html: renderEmailHtml({
        name,
        phone,
        email,
        course,
        startDate: startDate ?? null,
        lang: lang ?? 'bg'
      })
    });
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error('Failed to send email', error);
    return jsonResponse(500, { error: 'Failed to send email' });
  }
};

export default handler;
