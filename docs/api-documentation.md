# API Documentation

This document describes the REST API endpoints for the HVAC Business Website.

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://your-api.azurewebsites.net/api`

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

To obtain a token, use the login endpoint.

---

## Health Check

### GET /health

Check API status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

## Authentication

### POST /auth/login

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "admin@hvacbusiness.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@hvacbusiness.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

### GET /auth/profile

Get current user profile. (Requires authentication)

**Response:**
```json
{
  "id": 1,
  "email": "admin@hvacbusiness.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Services

### GET /services

Get all services.

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)

**Response:**
```json
[
  {
    "id": 1,
    "name": "AC Repair",
    "description": "Professional air conditioning repair...",
    "shortDescription": "Fast and reliable AC repair",
    "price": 150.00,
    "duration": 90,
    "icon": "build",
    "isActive": true,
    "sortOrder": 1,
    "features": ["Same-day service", "All brands serviced"]
  }
]
```

### GET /services/:id

Get a specific service.

### POST /services

Create a new service. (Admin only)

**Request Body:**
```json
{
  "name": "New Service",
  "description": "Service description...",
  "shortDescription": "Short description",
  "price": 199.00,
  "duration": 60,
  "icon": "build",
  "isActive": true,
  "sortOrder": 5,
  "features": ["Feature 1", "Feature 2"]
}
```

### PUT /services/:id

Update a service. (Admin only)

### DELETE /services/:id

Delete a service. (Admin only)

---

## Customers

All customer endpoints require authentication.

### GET /customers

Get all customers with pagination.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `search` (optional): Search term

**Response:**
```json
{
  "customers": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "(555) 111-2222",
      "address": "123 Main St",
      "city": "Your City",
      "state": "ST",
      "zipCode": "12345",
      "serviceCount": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### GET /customers/:id

Get a customer with equipment and service history.

### POST /customers

Create a new customer.

### PUT /customers/:id

Update a customer.

### DELETE /customers/:id

Delete a customer. (Admin only)

---

## Blog Posts

### GET /blog

Get blog posts with pagination.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `published` (optional): Filter published posts only

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "HVAC Tips for Summer",
      "slug": "hvac-tips-summer",
      "excerpt": "Stay cool this summer...",
      "content": "<p>Full content...</p>",
      "featuredImage": "https://...",
      "isPublished": true,
      "publishDate": "2024-01-15T00:00:00.000Z",
      "tags": ["tips", "summer"],
      "authorFirstName": "Admin",
      "authorLastName": "User"
    }
  ],
  "pagination": {...}
}
```

### GET /blog/slug/:slug

Get a blog post by slug.

### GET /blog/:id

Get a blog post by ID.

### POST /blog

Create a blog post. (Admin only)

### PUT /blog/:id

Update a blog post. (Admin only)

### DELETE /blog/:id

Delete a blog post. (Admin only)

---

## Testimonials

### GET /testimonials

Get testimonials with pagination.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `approved` (optional): Filter approved only

### POST /testimonials

Submit a new testimonial (public).

**Request Body:**
```json
{
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "content": "Great service!",
  "rating": 5,
  "serviceType": "AC Repair"
}
```

### PATCH /testimonials/:id/approve

Approve or reject a testimonial. (Admin only)

**Request Body:**
```json
{
  "isApproved": true
}
```

---

## Service Requests

### POST /service-requests

Submit a service request (public).

**Request Body:**
```json
{
  "customerName": "John Smith",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "address": "123 Main St",
  "city": "Your City",
  "state": "ST",
  "zipCode": "12345",
  "serviceType": "AC Repair",
  "preferredDate": "2024-01-20",
  "preferredTime": "10:00 AM - 12:00 PM",
  "message": "AC not cooling properly",
  "isEmergency": false
}
```

### GET /service-requests

Get all service requests. (Requires authentication)

**Query Parameters:**
- `status` (optional): Filter by status (pending/confirmed/completed/cancelled)

### PATCH /service-requests/:id

Update a service request. (Requires authentication)

**Request Body:**
```json
{
  "status": "confirmed",
  "assignedTechnician": "Mike",
  "scheduledDate": "2024-01-20T10:00:00.000Z",
  "notes": "Customer prefers morning"
}
```

---

## Settings

### GET /settings

Get all settings.

### PUT /settings

Update settings. (Admin only)

**Request Body:**
```json
{
  "companyName": "Your HVAC Company",
  "companyPhone": "(555) 123-4567",
  "companyEmail": "info@hvaccompany.com"
}
```

### GET /settings/pages/:pageId

Get page content.

### PUT /settings/pages/:pageId

Update page content. (Admin only)

---

## Email

### POST /email/contact

Submit contact form (public).

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "subject": "General Inquiry",
  "message": "I have a question..."
}
```

### POST /email/send-reminder

Send manual reminder email. (Admin only)

**Request Body:**
```json
{
  "to": "customer@example.com",
  "customerName": "John Smith",
  "subject": "Maintenance Reminder",
  "message": "Your annual maintenance is due..."
}
```

---

## Equipment

All equipment endpoints require authentication.

### GET /equipment

Get all equipment.

**Query Parameters:**
- `customerId` (optional): Filter by customer

### GET /equipment/due-maintenance

Get equipment due for maintenance.

### POST /equipment

Create equipment record.

### PUT /equipment/:id

Update equipment.

### DELETE /equipment/:id

Delete equipment. (Admin only)

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Validation Errors

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```
