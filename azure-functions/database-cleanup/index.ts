import { app, Timer, InvocationContext } from '@azure/functions';
import * as sql from 'mssql';

const databaseCleanupHandler = async (_timer: Timer, context: InvocationContext): Promise<void> => {
  context.log('Database cleanup function started at:', new Date().toISOString());

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

    // Cleanup old email logs (older than 90 days)
    const emailLogsResult = await pool.request().query(`
      DELETE FROM EmailLogs 
      WHERE createdAt < DATEADD(day, -90, GETDATE())
    `);
    context.log(`Deleted ${emailLogsResult.rowsAffected[0]} old email logs`);

    // Cleanup cancelled service requests older than 30 days
    const cancelledRequestsResult = await pool.request().query(`
      DELETE FROM ServiceRequests 
      WHERE status = 'cancelled' AND createdAt < DATEADD(day, -30, GETDATE())
    `);
    context.log(`Deleted ${cancelledRequestsResult.rowsAffected[0]} old cancelled service requests`);

    // Cleanup completed service requests older than 1 year
    const completedRequestsResult = await pool.request().query(`
      DELETE FROM ServiceRequests 
      WHERE status = 'completed' AND createdAt < DATEADD(year, -1, GETDATE())
    `);
    context.log(`Deleted ${completedRequestsResult.rowsAffected[0]} old completed service requests`);

    // Update statistics
    await pool.request().query(`
      UPDATE STATISTICS Customers;
      UPDATE STATISTICS Equipment;
      UPDATE STATISTICS ServiceHistory;
      UPDATE STATISTICS BlogPosts;
      UPDATE STATISTICS Testimonials;
    `);
    context.log('Database statistics updated');

    await pool.close();
    context.log('Database cleanup function completed successfully');
  } catch (error) {
    context.error('Database cleanup function failed:', error);
    throw error;
  }
};

app.timer('databaseCleanup', {
  schedule: '0 0 3 * * *', // Run at 3 AM daily
  handler: databaseCleanupHandler,
});
