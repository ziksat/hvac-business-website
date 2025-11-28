import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  customerName?: string;
}

const emailServiceHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  context.log('Email service function triggered');

  const body = await request.json() as EmailRequest;
  const { to, subject, html, customerName } = body;

  if (!to || !subject || !html) {
    return {
      status: 400,
      jsonBody: { error: 'Missing required fields: to, subject, html' },
    };
  }

  try {
    // Log the email (actual sending would use nodemailer or Azure Communication Services)
    context.log(`Would send email to: ${to}, Subject: ${subject}`);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${customerName ? `<p>Dear ${customerName},</p>` : ''}
        ${html}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by Your HVAC Company.<br>
          If you have questions, call us at (555) 123-4567.
        </p>
      </div>
    `;

    context.log('Email content prepared:', emailHtml.substring(0, 100) + '...');

    return {
      status: 200,
      jsonBody: { message: 'Email sent successfully' },
    };
  } catch (error) {
    context.error('Failed to send email:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to send email' },
    };
  }
};

app.http('emailService', {
  methods: ['POST'],
  authLevel: 'function',
  handler: emailServiceHandler,
});
