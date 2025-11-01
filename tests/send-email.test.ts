type HandlerModule = typeof import('../netlify/functions/send-email');

(async () => {
  try {
    process.env.SMTP_TRANSPORT = 'json';
    process.env.SMTP_HOST = 'test.smtp.local';
    process.env.SMTP_PORT = '2525';
    process.env.SMTP_SECURE = 'false';
    process.env.SMTP_USER = 'tester@example.com';
    process.env.SMTP_PASS = 'secret';
    process.env.CONTACT_TO_EMAIL = 'recipient@example.com';

    const { handler } = (await import('../netlify/functions/send-email.ts')) as HandlerModule;

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        name: 'Test Sender',
        phone: '+359123456789',
        email: 'sender@example.com',
        course: 'b_standard',
        note: 'Тестово запитване',
        startDate: new Date().toISOString(),
        lang: 'bg'
      }),
      headers: {}
    } as const;

    const response = await handler(event);
    console.log('Response:', response);

    if (response.statusCode !== 200) {
      console.error('Error payload:', response.body);
      process.exitCode = 1;
      return;
    }

    const parsed = JSON.parse(response.body) as { ok?: boolean; messageId?: string | null };
    console.log('Parsed payload:', parsed);

    if (!parsed.ok) {
      console.error('Unexpected payload:', response.body);
      process.exitCode = 1;
      return;
    }

    console.log('Email send simulation succeeded.');
  } catch (error) {
    console.error('Test execution failed', error);
    process.exitCode = 1;
  }
})();
