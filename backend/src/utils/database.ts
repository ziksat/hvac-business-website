import sql, { ConnectionPool, config as SqlConfig } from 'mssql';
import config from '../config';

let pool: ConnectionPool | null = null;

export const getPool = async (): Promise<ConnectionPool> => {
  if (pool) {
    return pool;
  }

  const sqlConfig: SqlConfig = {
    server: config.db.server,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port,
    options: config.db.options,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  try {
    pool = await sql.connect(sqlConfig);
    console.log('Connected to Azure SQL Database');
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
};

export { sql };
