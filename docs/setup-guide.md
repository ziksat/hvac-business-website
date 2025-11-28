# Setup Guide

This guide walks you through setting up the HVAC Business Website for local development.

## Prerequisites

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm**: Comes with Node.js
- **SQL Server** or **Azure SQL Database**: For database
- **Git**: For version control

## Step 1: Clone the Repository

```bash
git clone https://github.com/ziksat/hvac-business-website.git
cd hvac-business-website
```

## Step 2: Database Setup

### Option A: Azure SQL Database (Recommended)

1. Create an Azure SQL Server and Database in the Azure Portal
2. Note down the server name, database name, username, and password
3. Configure firewall rules to allow your IP address

### Option B: Local SQL Server

1. Install SQL Server Express or SQL Server Developer Edition
2. Create a new database named `hvac_database`
3. Note down the connection details

### Initialize the Database

1. Connect to your database using SQL Server Management Studio or Azure Data Studio
2. Run the schema script:
   ```sql
   -- Execute database/schema.sql
   ```
3. Run the seed data script:
   ```sql
   -- Execute database/seed-data.sql
   ```

## Step 3: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   
   # Database
   DB_SERVER=your-server.database.windows.net
   DB_DATABASE=hvac_database
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_PORT=1433
   
   # JWT
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   
   # Email (optional for development)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@yourhvacbusiness.com
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. Build and start the backend:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Or production build
   npm run build
   npm start
   ```

6. Verify the API is running:
   - Open http://localhost:3001/api/health
   - You should see: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

## Step 4: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_COMPANY_NAME=Your HVAC Company
   ```

5. Start the frontend:
   ```bash
   npm start
   ```

6. The application will open at http://localhost:3000

## Step 5: Azure Functions Setup (Optional)

For local Azure Functions development:

1. Install Azure Functions Core Tools:
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

2. Navigate to the azure-functions directory:
   ```bash
   cd azure-functions
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Update `local.settings.json` with your configuration

5. Start the functions:
   ```bash
   npm run build
   npm start
   ```

## Step 6: Access the Application

### Public Website
- Homepage: http://localhost:3000
- Services: http://localhost:3000/services
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact
- Blog: http://localhost:3000/blog
- Book Service: http://localhost:3000/book-service

### Admin Dashboard
- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin

### Default Admin Credentials
- **Email**: admin@hvacbusiness.com
- **Password**: Admin123!

## Troubleshooting

### Database Connection Issues

1. Check if your IP is whitelisted in Azure SQL firewall
2. Verify connection string parameters
3. Ensure the database exists and schema is applied

### Frontend Not Loading

1. Clear browser cache
2. Check if backend API is running
3. Verify REACT_APP_API_URL in .env

### Backend Errors

1. Check the console for error messages
2. Verify environment variables
3. Ensure database is accessible

## Next Steps

- Customize the content in the Settings panel
- Add your own services
- Configure email settings for notifications
- Set up Azure deployment for production
