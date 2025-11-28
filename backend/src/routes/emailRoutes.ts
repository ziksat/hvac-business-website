import { Router } from 'express';
import { Request, Response } from 'express';
import { sendEmail } from '../utils/email';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import config from '../config';

const router = Router();

// Contact form submission - public
router.post('/contact', async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  try {
    // Send email to the company
    await sendEmail({
      to: config.email.from,
      subject: `Contact Form: ${subject || 'New Message'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send confirmation email to customer
    await sendEmail({
      to: email,
      subject: 'We received your message - HVAC Company',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>If you need immediate assistance, please call us at (555) 123-4567.</p>
        <p>Best regards,<br>The HVAC Team</p>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Send manual reminder - admin only
router.post('/send-reminder', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
  const { to, customerName, subject, message } = req.body;

  if (!to || !subject || !message) {
    res.status(400).json({ error: 'To, subject, and message are required' });
    return;
  }

  try {
    await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${customerName ? `<p>Dear ${customerName},</p>` : ''}
          ${message.replace(/\n/g, '<br>')}
          <p>Best regards,<br>The HVAC Team</p>
        </div>
      `,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
