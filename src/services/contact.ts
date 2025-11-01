export interface ContactFormSubmission {
  name: string;
  phone: string;
  email: string;
  course: string;
  note: string;
  startDate: string | null;
  lang: string;
}

interface SubmitOptions {
  endpoint?: string;
}

const defaultEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/.netlify/functions/send-email';

export async function submitContactForm(
  submission: ContactFormSubmission,
  options: SubmitOptions = {}
): Promise<void> {
  const endpoint = options.endpoint ?? defaultEndpoint;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const data = (await response.json()) as { error?: string };
      if (data?.error) {
        errorMessage = data.error;
      }
    } catch (error) {
      // ignore parsing error and keep fallback message
    }
    throw new Error(errorMessage);
  }
}
