import { AzureFunction, Context } from '@azure/functions';
import * as sql from 'mssql';
import * as nodemailer from 'nodemailer';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  equipmentType: string;
  lastServiceDate: Date;
}

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  context.log('Maintenance reminder function started at:', new Date().toISOString());

  try {
    // Database configuration
    const dbConfig: sql.config = {
      server: process.env.DB_SERVER || '',
      database: process.env.DB_DATABASE || '',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    };

    // Connect to database
    const pool = await sql.connect(dbConfig);

    // Find customers due for maintenance (haven't had service in 365 days or more)
    const result = await pool.request().query<Customer>(`
      SELECT DISTINCT 
        c.id, c.firstName, c.lastName, c.email,
        e.type as equipmentType,
        MAX(sh.serviceDate) as lastServiceDate
      FROM Customers c
      INNER JOIN Equipment e ON e.customerId = c.id
      LEFT JOIN ServiceHistory sh ON sh.customerId = c.id
      LEFT JOIN MaintenanceSchedules ms ON ms.customerId = c.id
      WHERE c.email IS NOT NULL AND c.email != ''
        AND (ms.lastNotificationDate IS NULL OR DATEDIFF(day, ms.lastNotificationDate, GETDATE()) >= 30)
      GROUP BY c.id, c.firstName, c.lastName, c.email, e.type
      HAVING MAX(sh.serviceDate) IS NULL OR DATEDIFF(day, MAX(sh.serviceDate), GETDATE()) >= 335
    `);

    const customers = result.recordset;
    context.log(`Found ${customers.length} customers due for maintenance reminders`);

    if (customers.length === 0) {
      context.log('No customers need reminders today');
      await pool.close();
      return;
    }

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

    const frontendUrl = process.env.FRONTEND_URL || 'https://yourhvacbusiness.com';
    let sentCount = 0;
    let errorCount = 0;

    for (const customer of customers) {
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1976d2;">Annual HVAC Maintenance Reminder</h2>
            <p>Dear ${customer.firstName} ${customer.lastName},</p>
            <p>It's time for your annual ${customer.equipmentType || 'HVAC'} maintenance!</p>
            ${customer.lastServiceDate ? 
              `<p>Your last service was on ${new Date(customer.lastServiceDate).toLocaleDateString()}.</p>` : 
              `<p>We don't have a record of your last service date.</p>`
            }
            <p>Regular maintenance is essential to:</p>
            <ul>
              <li>Ensure optimal efficiency and performance</li>
              <li>Extend the life of your equipment</li>
              <li>Prevent costly breakdowns</li>
              <li>Maintain indoor air quality</li>
            </ul>
            <p>
              <a href="${frontendUrl}/book-service" 
                 style="display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px;">
                Schedule Your Maintenance
              </a>
            </p>
            <p>Or call us at <strong>(555) 123-4567</strong> to book your appointment.</p>
            <p>Thank you for choosing us for your HVAC needs!</p>
            <p>Best regards,<br>Your HVAC Team</p>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: customer.email,
          subject: 'Time for Your Annual HVAC Maintenance!',
          html: emailHtml,
        });

        // Log the sent email
        await pool.request()
          .input('recipientEmail', sql.NVarChar, customer.email)
          .input('recipientName', sql.NVarChar, `${customer.firstName} ${customer.lastName}`)
          .input('subject', sql.NVarChar, 'Time for Your Annual HVAC Maintenance!')
          .input('emailType', sql.NVarChar, 'reminder')
          .input('status', sql.NVarChar, 'sent')
          .query(`
            INSERT INTO EmailLogs (recipientEmail, recipientName, subject, emailType, status, sentAt, createdAt)
            VALUES (@recipientEmail, @recipientName, @subject, @emailType, @status, GETDATE(), GETDATE())
          `);

        // Update maintenance schedule
        await pool.request()
          .input('customerId', sql.Int, customer.id)
          .query(`
            MERGE MaintenanceSchedules AS target
            USING (SELECT @customerId AS customerId) AS source
            ON target.customerId = source.customerId
            WHEN MATCHED THEN 
              UPDATE SET lastNotificationDate = GETDATE(), nextNotificationDate = DATEADD(month, 11, GETDATE()), updatedAt = GETDATE()
            WHEN NOT MATCHED THEN 
              INSERT (customerId, scheduleType, lastNotificationDate, nextNotificationDate, isActive, createdAt)
              VALUES (@customerId, 'yearly', GETDATE(), DATEADD(month, 11, GETDATE()), 1, GETDATE());
          `);

        sentCount++;
        context.log(`Sent reminder to ${customer.email}`);
      } catch (emailError) {
        errorCount++;
        context.log.error(`Failed to send email to ${customer.email}:`, emailError);

        // Log failed email
        await pool.request()
          .input('recipientEmail', sql.NVarChar, customer.email)
          .input('recipientName', sql.NVarChar, `${customer.firstName} ${customer.lastName}`)
          .input('subject', sql.NVarChar, 'Time for Your Annual HVAC Maintenance!')
          .input('emailType', sql.NVarChar, 'reminder')
          .input('status', sql.NVarChar, 'failed')
          .input('errorMessage', sql.NVarChar, String(emailError))
          .query(`
            INSERT INTO EmailLogs (recipientEmail, recipientName, subject, emailType, status, errorMessage, createdAt)
            VALUES (@recipientEmail, @recipientName, @subject, @emailType, @status, @errorMessage, GETDATE())
          `);
      }
    }

    await pool.close();
    context.log(`Maintenance reminder function completed. Sent: ${sentCount}, Errors: ${errorCount}`);
  } catch (error) {
    context.log.error('Maintenance reminder function failed:', error);
    throw error;
  }
};

export default timerTrigger;
