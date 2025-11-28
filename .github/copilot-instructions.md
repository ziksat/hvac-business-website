# Copilot Instructions for HVAC Business Website

## Project Overview

This is a comprehensive HVAC (Heating, Ventilation, and Air Conditioning) business website with a CMS dashboard, designed for Azure deployment. The project consists of a React frontend, Node.js/Express backend API, and Azure Functions for automation.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Data Fetching**: TanStack React Query v5
- **Build Tool**: Create React App (react-scripts)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Input Validation**: express-validator
- **Database**: Azure SQL Database (mssql driver)
- **Security**: helmet, cors, express-rate-limit

### Azure Services
- Azure App Service (Web + API)
- Azure SQL Database
- Azure Functions (Timer-triggered)
- Azure Blob Storage
- Azure Application Insights

## Project Structure

```
/
├── frontend/           # React.js frontend application
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Public website pages
│   │   ├── admin/      # Admin dashboard components
│   │   ├── services/   # API service functions
│   │   ├── context/    # React context providers
│   │   ├── types/      # TypeScript types
│   │   └── styles/     # CSS and styling files
│   └── public/         # Static assets
├── backend/            # Node.js backend API
│   ├── src/
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # Express middleware
│   │   ├── routes/     # API routes
│   │   ├── utils/      # Utility functions
│   │   └── config/     # Configuration
├── azure-functions/    # Azure Functions for automation
├── database/           # SQL scripts and schema
├── azure/              # Azure deployment files (ARM templates)
├── docs/               # Documentation
└── .github/workflows/  # GitHub Actions CI/CD
```

## Development Commands

### Installation
```bash
# Install all dependencies (from root)
npm run install:all

# Or install individually
cd backend && npm install
cd frontend && npm install
cd azure-functions && npm install
```

### Running Development Servers
```bash
# Backend (runs on port 3001)
cd backend && npm run dev

# Frontend (runs on port 3000)
cd frontend && npm start
```

### Building
```bash
# Build all
npm run build:all

# Build individually
cd backend && npm run build
cd frontend && npm run build
cd azure-functions && npm run build
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Linting
```bash
# Backend linting
cd backend && npm run lint
```

## Coding Conventions

### TypeScript
- Use strict TypeScript mode (`strict: true` in tsconfig)
- Prefer explicit type annotations for function parameters and return types
- Use interfaces for object shapes, types for unions/intersections
- Use ES2020 target features

### React Components
- Use functional components with hooks
- Prefer named exports for components
- Use Material-UI components for UI elements
- Follow the existing component patterns in `frontend/src/components/`

### Express Backend
- Use async/await for asynchronous operations
- Apply proper error handling with try/catch blocks
- Use express-validator for input validation
- Follow RESTful API conventions
- Prefix all API routes with `/api/`

### Code Style
- Use camelCase for variables and functions
- Use PascalCase for React components and TypeScript types/interfaces
- Use meaningful, descriptive names
- Keep functions focused and single-purpose

## API Endpoints Pattern

All API routes follow this pattern:
- Authentication: `POST /api/auth/login`
- Resources: `GET|POST /api/{resource}`, `GET|PUT|DELETE /api/{resource}/:id`
- Nested resources: `GET /api/{parent}/:id/{child}`

## Security Practices

- All admin routes require JWT authentication
- Use bcryptjs for password hashing
- Apply rate limiting on API endpoints
- Use helmet for security headers
- Validate and sanitize all user inputs
- Never commit secrets or credentials to the repository

## Environment Variables

### Backend (.env)
- `PORT`, `NODE_ENV` - Server configuration
- `DB_SERVER`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` - Database connection
- `JWT_SECRET`, `JWT_EXPIRES_IN` - Authentication
- `EMAIL_*` - Email service configuration
- `FRONTEND_URL` - CORS configuration

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_COMPANY_NAME` - Company branding

## Important Patterns

### Error Handling (Backend)
- Use the centralized error handler in `middleware/errorHandler.ts`
- Throw errors with appropriate HTTP status codes
- Return consistent error response format

### Authentication Flow
- Admin login via `/api/auth/login`
- JWT token returned on successful login
- Token included in Authorization header for protected routes
- Protected routes use auth middleware

### Database Access
- Use mssql connection pooling
- SQL queries in controller files
- Use parameterized queries to prevent SQL injection

## Documentation

- API documentation: `docs/api-documentation.md`
- Deployment guide: `docs/deployment.md`
- Setup guide: `docs/setup-guide.md`
