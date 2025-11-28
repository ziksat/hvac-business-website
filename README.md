# HVAC Business Website

A comprehensive, production-ready HVAC business website with CMS and Azure deployment.

## Features

### Public Website
- **Homepage**: Hero section, services overview, testimonials, call-to-action buttons
- **Services Page**: Detailed HVAC services with pricing
- **About Page**: Company information, team members, certifications
- **Contact Page**: Contact form, business hours, location
- **Blog Section**: HVAC tips, seasonal advice, company news
- **Service Booking**: Online service request with date/time selection
- **Mobile-responsive design** for all devices
- **SEO optimization** with meta tags

### Admin CMS Dashboard
- **Dashboard**: Overview statistics and quick actions
- **Customer Management**: Full customer database with service history
- **Service Management**: Add/edit/delete services with descriptions and pricing
- **Blog Management**: Create/edit/publish blog posts
- **Testimonial Management**: Approve/edit customer testimonials
- **Service Request Management**: Track and manage service requests
- **Settings Panel**: Update company info, contact details, business hours

### Automated Features
- **Maintenance Reminders**: Automated yearly email reminders via Azure Functions
- **Email Service**: Automated email notifications for service requests
- **Database Cleanup**: Periodic cleanup of old data

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI for styling
- React Router for navigation
- React Hook Form for form handling
- React Query for data fetching

### Backend
- Node.js with Express
- TypeScript
- JWT Authentication
- Bcrypt for password hashing
- Express Validator for input validation
- Rate limiting and security middleware

### Database
- Azure SQL Database
- Connection pooling with mssql

### Azure Services
- Azure App Service (Web + API)
- Azure SQL Database
- Azure Functions (Timer-triggered)
- Azure Blob Storage
- Azure Application Insights

## Project Structure

```
/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Main pages (Home, Services, Contact, etc.)
│   │   ├── admin/           # Admin dashboard components
│   │   ├── services/        # API service functions
│   │   ├── context/         # React context providers
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # CSS and styling files
│   └── public/              # Static assets
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration
│   └── migrations/          # Database migrations
├── azure-functions/         # Azure Functions for automation
│   ├── maintenance-reminder/
│   ├── email-service/
│   └── database-cleanup/
├── database/               # SQL scripts and schema
│   ├── schema.sql
│   └── seed-data.sql
├── azure/                  # Azure deployment files
│   └── arm-templates/
├── docs/                   # Documentation
└── .github/workflows/      # GitHub Actions CI/CD
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Azure SQL Database (or SQL Server for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ziksat/hvac-business-website.git
cd hvac-business-website
```

2. Install backend dependencies:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Run the schema.sql script in your Azure SQL database
# Run the seed-data.sql script for initial data
```

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

6. Access the application:
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin/login
- API: http://localhost:3001

### Default Admin Credentials
- Email: admin@hvacbusiness.com
- Password: Admin123!

## Deployment

See [docs/deployment.md](docs/deployment.md) for detailed Azure deployment instructions.

### Quick Deploy with ARM Templates

```bash
# Login to Azure
az login

# Create resource group
az group create --name hvac-rg --location eastus

# Deploy resources
az deployment group create \
  --resource-group hvac-rg \
  --template-file azure/arm-templates/main.json \
  --parameters azure/arm-templates/parameters.json
```

## API Documentation

See [docs/api-documentation.md](docs/api-documentation.md) for complete API reference.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/services | Get all services |
| GET | /api/blog | Get blog posts |
| GET | /api/testimonials | Get testimonials |
| POST | /api/service-requests | Create service request |
| POST | /api/email/contact | Submit contact form |

## Security Features

- JWT authentication for admin access
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS enforcement
- CORS configuration
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For questions or support, please open an issue on GitHub.
