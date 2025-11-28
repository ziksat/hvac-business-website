import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as nodemailer from 'nodemailer';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  customerName?: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Email service function triggered');

  const { to, subject, html, customerName } = req.body as EmailRequest;

  if (!to || !subject || !html) {
    context.res = {
      status: 400,
      body: { error: 'Missing required fields: to, subject, html' },
    };
    return;
  }

  try {
    // Email configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: emailHtml,
    });

    context.log(`Email sent successfully to ${to}`);
    context.res = {
      status: 200,
      body: { message: 'Email sent successfully' },
    };
  } catch (error) {
    context.log.error('Failed to send email:', error);
    context.res = {
      status: 500,
      body: { error: 'Failed to send email' },
    };
  }
};

export default httpTrigger;
