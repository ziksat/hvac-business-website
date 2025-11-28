import { app, Timer, InvocationContext } from '@azure/functions';
import * as sql from 'mssql';

const maintenanceReminderHandler = async (_timer: Timer, context: InvocationContext): Promise<void> => {
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
    interface Customer {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      equipmentType: string;
      lastServiceDate: Date;
    }

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

    const frontendUrl = process.env.FRONTEND_URL || 'https://yourhvacbusiness.com';
    let sentCount = 0;
    let errorCount = 0;

    for (const customer of customers) {
      try {
        // Log the email (actual sending would use nodemailer or Azure Communication Services)
        context.log(`Would send reminder to: ${customer.email} for ${customer.equipmentType}`);

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
      } catch (emailError) {
        errorCount++;
        context.error(`Failed to process ${customer.email}:`, emailError);
      }
    }

    await pool.close();
    context.log(`Maintenance reminder function completed. Processed: ${sentCount}, Errors: ${errorCount}`);
  } catch (error) {
    context.error('Maintenance reminder function failed:', error);
    throw error;
  }
};

app.timer('maintenanceReminder', {
  schedule: '0 0 8 * * *', // Run at 8 AM daily
  handler: maintenanceReminderHandler,
});
