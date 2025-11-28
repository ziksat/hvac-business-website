export interface DbConfig {
  server: string;
  database: string;
  user: string;
  password: string;
  port: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
  };
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface Config {
  port: number;
  nodeEnv: string;
  db: DbConfig;
  jwt: JwtConfig;
  email: EmailConfig;
  frontendUrl: string;
  azureStorageConnectionString: string;
  azureStorageContainer: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'hvac_database',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: {
      encrypt: true,
      trustServerCertificate: process.env.NODE_ENV !== 'production',
      enableArithAbort: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@hvacbusiness.com',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
  azureStorageContainer: process.env.AZURE_STORAGE_CONTAINER || 'uploads',
};

export default config;
