import nodemailer from 'nodemailer';
import config from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendMaintenanceReminder = async (
  customerEmail: string,
  customerName: string,
  lastServiceDate: Date,
  equipmentType: string
): Promise<boolean> => {
  const subject = 'Time for Your Annual HVAC Maintenance!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">Annual HVAC Maintenance Reminder</h2>
      <p>Dear ${customerName},</p>
      <p>It's been a year since your last ${equipmentType} maintenance service on ${lastServiceDate.toLocaleDateString()}.</p>
      <p>Regular maintenance is essential to:</p>
      <ul>
        <li>Ensure optimal efficiency and performance</li>
        <li>Extend the life of your equipment</li>
        <li>Prevent costly breakdowns</li>
        <li>Maintain indoor air quality</li>
      </ul>
      <p>
        <a href="${config.frontendUrl}/book-service" 
           style="display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px;">
          Schedule Your Maintenance
        </a>
      </p>
      <p>Or call us at <strong>(555) 123-4567</strong> to book your appointment.</p>
      <p>Thank you for choosing us for your HVAC needs!</p>
      <p>Best regards,<br>Your HVAC Team</p>
    </div>
  `;

  return sendEmail({ to: customerEmail, subject, html });
};
