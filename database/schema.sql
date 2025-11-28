-- HVAC Business Website Database Schema
-- For Azure SQL Database

-- Users table (Admin and staff)
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    role NVARCHAR(50) DEFAULT 'user',
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Customers table
CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(50) NOT NULL,
    zipCode NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX) NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Services table
CREATE TABLE Services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    shortDescription NVARCHAR(500) NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL, -- in minutes
    icon NVARCHAR(100) NULL,
    image NVARCHAR(500) NULL,
    isActive BIT DEFAULT 1,
    sortOrder INT DEFAULT 0,
    features NVARCHAR(MAX) NULL, -- JSON array
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Equipment table
CREATE TABLE Equipment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerId INT NOT NULL,
    type NVARCHAR(100) NOT NULL, -- AC, Furnace, Heat Pump, etc.
    brand NVARCHAR(100) NOT NULL,
    model NVARCHAR(100) NOT NULL,
    serialNumber NVARCHAR(100) NULL,
    installationDate DATETIME NOT NULL,
    warrantyExpiry DATETIME NULL,
    maintenanceDue DATETIME NULL,
    notes NVARCHAR(MAX) NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE
);

-- Service History table
CREATE TABLE ServiceHistory (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerId INT NOT NULL,
    serviceId INT NULL,
    serviceDate DATETIME NOT NULL,
    technician NVARCHAR(100) NOT NULL,
    notes NVARCHAR(MAX) NULL,
    cost DECIMAL(10,2) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE,
    FOREIGN KEY (serviceId) REFERENCES Services(id) ON DELETE SET NULL
);

-- Blog Posts table
CREATE TABLE BlogPosts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(500) NOT NULL,
    slug NVARCHAR(500) NOT NULL UNIQUE,
    content NVARCHAR(MAX) NOT NULL,
    excerpt NVARCHAR(1000) NOT NULL,
    featuredImage NVARCHAR(500) NULL,
    isPublished BIT DEFAULT 0,
    publishDate DATETIME NULL,
    tags NVARCHAR(MAX) NULL, -- JSON array
    authorId INT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE SET NULL
);

-- Testimonials table
CREATE TABLE Testimonials (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerName NVARCHAR(200) NOT NULL,
    customerEmail NVARCHAR(255) NULL,
    content NVARCHAR(MAX) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    serviceType NVARCHAR(100) NULL,
    customerId INT NULL,
    isApproved BIT DEFAULT 0,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE SET NULL
);

-- Service Requests table
CREATE TABLE ServiceRequests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerName NVARCHAR(200) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    address NVARCHAR(255) NULL,
    city NVARCHAR(100) NULL,
    state NVARCHAR(50) NULL,
    zipCode NVARCHAR(20) NULL,
    serviceType NVARCHAR(200) NOT NULL,
    preferredDate DATETIME NOT NULL,
    preferredTime NVARCHAR(50) NULL,
    message NVARCHAR(MAX) NULL,
    isEmergency BIT DEFAULT 0,
    status NVARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    notes NVARCHAR(MAX) NULL,
    assignedTechnician NVARCHAR(100) NULL,
    scheduledDate DATETIME NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Settings table (key-value store for site settings)
CREATE TABLE Settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [key] NVARCHAR(100) NOT NULL UNIQUE,
    value NVARCHAR(MAX) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Page Content table (for CMS editable pages)
CREATE TABLE PageContent (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pageId NVARCHAR(100) NOT NULL UNIQUE, -- home, about, services, contact
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NULL,
    metaTitle NVARCHAR(200) NULL,
    metaDescription NVARCHAR(500) NULL,
    sections NVARCHAR(MAX) NULL, -- JSON for structured content
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Email Logs table (for tracking sent emails)
CREATE TABLE EmailLogs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    recipientEmail NVARCHAR(255) NOT NULL,
    recipientName NVARCHAR(200) NULL,
    subject NVARCHAR(500) NOT NULL,
    emailType NVARCHAR(100) NOT NULL, -- reminder, confirmation, contact
    status NVARCHAR(50) NOT NULL, -- sent, failed, pending
    sentAt DATETIME NULL,
    errorMessage NVARCHAR(MAX) NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Maintenance Schedules table
CREATE TABLE MaintenanceSchedules (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerId INT NOT NULL,
    equipmentId INT NULL,
    scheduleType NVARCHAR(50) NOT NULL, -- yearly, quarterly, monthly
    lastNotificationDate DATETIME NULL,
    nextNotificationDate DATETIME NOT NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE,
    FOREIGN KEY (equipmentId) REFERENCES Equipment(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IX_Customers_Email ON Customers(email);
CREATE INDEX IX_Customers_Phone ON Customers(phone);
CREATE INDEX IX_Equipment_CustomerId ON Equipment(customerId);
CREATE INDEX IX_Equipment_MaintenanceDue ON Equipment(maintenanceDue);
CREATE INDEX IX_ServiceHistory_CustomerId ON ServiceHistory(customerId);
CREATE INDEX IX_ServiceHistory_ServiceDate ON ServiceHistory(serviceDate);
CREATE INDEX IX_BlogPosts_Slug ON BlogPosts(slug);
CREATE INDEX IX_BlogPosts_IsPublished ON BlogPosts(isPublished);
CREATE INDEX IX_Testimonials_IsApproved ON Testimonials(isApproved);
CREATE INDEX IX_ServiceRequests_Status ON ServiceRequests(status);
CREATE INDEX IX_ServiceRequests_PreferredDate ON ServiceRequests(preferredDate);
CREATE INDEX IX_MaintenanceSchedules_NextNotification ON MaintenanceSchedules(nextNotificationDate);

-- =====================================================
-- ServiceTitan-like Features: Additional Tables
-- =====================================================

-- Technicians table (Field service technicians)
CREATE TABLE Technicians (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NULL, -- Links to Users table if they have login access
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    hireDate DATETIME NOT NULL,
    certifications NVARCHAR(MAX) NULL, -- JSON array of certifications
    skills NVARCHAR(MAX) NULL, -- JSON array of skills (HVAC, Plumbing, etc.)
    hourlyRate DECIMAL(10,2) NULL,
    status NVARCHAR(50) DEFAULT 'active', -- active, inactive, on_leave
    color NVARCHAR(20) NULL, -- For calendar display
    avatar NVARCHAR(500) NULL,
    address NVARCHAR(255) NULL,
    city NVARCHAR(100) NULL,
    state NVARCHAR(50) NULL,
    zipCode NVARCHAR(20) NULL,
    emergencyContact NVARCHAR(200) NULL,
    emergencyPhone NVARCHAR(20) NULL,
    notes NVARCHAR(MAX) NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL
);

-- Jobs table (Work orders / Job tickets)
CREATE TABLE Jobs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    jobNumber NVARCHAR(50) NOT NULL UNIQUE,
    customerId INT NOT NULL,
    serviceRequestId INT NULL, -- Link to original service request if applicable
    serviceType NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NULL,
    priority NVARCHAR(50) DEFAULT 'normal', -- low, normal, high, emergency
    status NVARCHAR(50) DEFAULT 'scheduled', -- scheduled, dispatched, in_progress, completed, cancelled, on_hold
    scheduledStartDate DATETIME NOT NULL,
    scheduledEndDate DATETIME NULL,
    actualStartDate DATETIME NULL,
    actualEndDate DATETIME NULL,
    estimatedDuration INT NULL, -- in minutes
    actualDuration INT NULL, -- in minutes
    address NVARCHAR(255) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(50) NOT NULL,
    zipCode NVARCHAR(20) NOT NULL,
    accessNotes NVARCHAR(MAX) NULL, -- Gate codes, parking info, etc.
    customerNotes NVARCHAR(MAX) NULL,
    technicianNotes NVARCHAR(MAX) NULL,
    completionNotes NVARCHAR(MAX) NULL,
    customerSignature NVARCHAR(MAX) NULL, -- Base64 encoded signature
    signedAt DATETIME NULL,
    tags NVARCHAR(MAX) NULL, -- JSON array of tags
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE,
    FOREIGN KEY (serviceRequestId) REFERENCES ServiceRequests(id) ON DELETE SET NULL
);

-- Job Technicians (Many-to-many: Jobs to Technicians)
CREATE TABLE JobTechnicians (
    id INT IDENTITY(1,1) PRIMARY KEY,
    jobId INT NOT NULL,
    technicianId INT NOT NULL,
    isPrimary BIT DEFAULT 0, -- Primary technician for the job
    assignedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (technicianId) REFERENCES Technicians(id) ON DELETE CASCADE
);

-- Inventory / Parts table
CREATE TABLE Inventory (
    id INT IDENTITY(1,1) PRIMARY KEY,
    sku NVARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NULL,
    category NVARCHAR(100) NOT NULL,
    brand NVARCHAR(100) NULL,
    unitCost DECIMAL(10,2) NOT NULL,
    sellingPrice DECIMAL(10,2) NOT NULL,
    quantityOnHand INT DEFAULT 0,
    reorderPoint INT DEFAULT 5,
    reorderQuantity INT DEFAULT 10,
    location NVARCHAR(100) NULL, -- Warehouse location/bin
    supplier NVARCHAR(200) NULL,
    supplierPartNumber NVARCHAR(100) NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL
);

-- Job Parts Used (Parts used on a job)
CREATE TABLE JobParts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    jobId INT NOT NULL,
    inventoryId INT NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL, -- Price charged to customer
    cost DECIMAL(10,2) NOT NULL, -- Actual cost
    notes NVARCHAR(500) NULL,
    addedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (inventoryId) REFERENCES Inventory(id) ON DELETE NO ACTION
);

-- Job Labor (Labor entries for a job)
CREATE TABLE JobLabor (
    id INT IDENTITY(1,1) PRIMARY KEY,
    jobId INT NOT NULL,
    technicianId INT NOT NULL,
    laborType NVARCHAR(100) NOT NULL, -- regular, overtime, travel, etc.
    hours DECIMAL(5,2) NOT NULL,
    rate DECIMAL(10,2) NOT NULL, -- Hourly rate
    description NVARCHAR(500) NULL,
    startTime DATETIME NULL,
    endTime DATETIME NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (technicianId) REFERENCES Technicians(id) ON DELETE NO ACTION
);

-- Estimates / Quotes
CREATE TABLE Estimates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    estimateNumber NVARCHAR(50) NOT NULL UNIQUE,
    customerId INT NOT NULL,
    jobId INT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NULL,
    status NVARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, approved, declined, expired
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    taxRate DECIMAL(5,2) DEFAULT 0,
    taxAmount DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    discountType NVARCHAR(20) DEFAULT 'fixed', -- fixed, percentage
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    validUntil DATETIME NULL,
    notes NVARCHAR(MAX) NULL,
    terms NVARCHAR(MAX) NULL,
    customerSignature NVARCHAR(MAX) NULL,
    signedAt DATETIME NULL,
    sentAt DATETIME NULL,
    approvedAt DATETIME NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE SET NULL
);

-- Estimate Line Items
CREATE TABLE EstimateItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    estimateId INT NOT NULL,
    itemType NVARCHAR(50) NOT NULL, -- service, part, labor, discount
    description NVARCHAR(500) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unitPrice DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    inventoryId INT NULL, -- Link to inventory if it's a part
    serviceId INT NULL, -- Link to service if it's a service
    sortOrder INT DEFAULT 0,
    FOREIGN KEY (estimateId) REFERENCES Estimates(id) ON DELETE CASCADE,
    FOREIGN KEY (inventoryId) REFERENCES Inventory(id) ON DELETE SET NULL,
    FOREIGN KEY (serviceId) REFERENCES Services(id) ON DELETE SET NULL
);

-- Invoices
CREATE TABLE Invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoiceNumber NVARCHAR(50) NOT NULL UNIQUE,
    customerId INT NOT NULL,
    jobId INT NULL,
    estimateId INT NULL,
    status NVARCHAR(50) DEFAULT 'draft', -- draft, sent, viewed, partial, paid, overdue, void
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    taxRate DECIMAL(5,2) DEFAULT 0,
    taxAmount DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    discountType NVARCHAR(20) DEFAULT 'fixed', -- fixed, percentage
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    amountPaid DECIMAL(10,2) DEFAULT 0,
    balanceDue DECIMAL(10,2) NOT NULL DEFAULT 0,
    dueDate DATETIME NULL,
    notes NVARCHAR(MAX) NULL,
    terms NVARCHAR(MAX) NULL,
    sentAt DATETIME NULL,
    paidAt DATETIME NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE SET NULL,
    FOREIGN KEY (estimateId) REFERENCES Estimates(id) ON DELETE SET NULL
);

-- Invoice Line Items
CREATE TABLE InvoiceItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoiceId INT NOT NULL,
    itemType NVARCHAR(50) NOT NULL, -- service, part, labor, discount
    description NVARCHAR(500) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unitPrice DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    inventoryId INT NULL,
    serviceId INT NULL,
    sortOrder INT DEFAULT 0,
    FOREIGN KEY (invoiceId) REFERENCES Invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (inventoryId) REFERENCES Inventory(id) ON DELETE SET NULL,
    FOREIGN KEY (serviceId) REFERENCES Services(id) ON DELETE SET NULL
);

-- Payments
CREATE TABLE Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoiceId INT NOT NULL,
    paymentNumber NVARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    paymentMethod NVARCHAR(50) NOT NULL, -- cash, check, credit_card, debit_card, bank_transfer, other
    paymentDate DATETIME NOT NULL,
    referenceNumber NVARCHAR(100) NULL, -- Check number, transaction ID, etc.
    notes NVARCHAR(500) NULL,
    status NVARCHAR(50) DEFAULT 'completed', -- completed, pending, failed, refunded
    processedBy NVARCHAR(100) NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (invoiceId) REFERENCES Invoices(id) ON DELETE CASCADE
);

-- Technician Timesheets
CREATE TABLE Timesheets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    technicianId INT NOT NULL,
    jobId INT NULL,
    date DATE NOT NULL,
    clockIn DATETIME NOT NULL,
    clockOut DATETIME NULL,
    breakMinutes INT DEFAULT 0,
    totalHours DECIMAL(5,2) NULL,
    type NVARCHAR(50) DEFAULT 'regular', -- regular, overtime, travel, training
    status NVARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    notes NVARCHAR(500) NULL,
    approvedBy INT NULL,
    approvedAt DATETIME NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (technicianId) REFERENCES Technicians(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE SET NULL,
    FOREIGN KEY (approvedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Dispatch Board / Schedule
CREATE TABLE DispatchSchedule (
    id INT IDENTITY(1,1) PRIMARY KEY,
    jobId INT NOT NULL,
    technicianId INT NOT NULL,
    scheduledDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    status NVARCHAR(50) DEFAULT 'scheduled', -- scheduled, en_route, on_site, completed, cancelled
    notes NVARCHAR(500) NULL,
    dispatchedAt DATETIME NULL,
    dispatchedBy INT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME NULL,
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (technicianId) REFERENCES Technicians(id) ON DELETE CASCADE,
    FOREIGN KEY (dispatchedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- GPS Tracking / Technician Location (for fleet tracking)
CREATE TABLE TechnicianLocations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    technicianId INT NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    accuracy DECIMAL(10,2) NULL,
    heading DECIMAL(5,2) NULL,
    speed DECIMAL(5,2) NULL,
    recordedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (technicianId) REFERENCES Technicians(id) ON DELETE CASCADE
);

-- Additional indexes for new tables
CREATE INDEX IX_Technicians_Status ON Technicians(status);
CREATE INDEX IX_Jobs_Status ON Jobs(status);
CREATE INDEX IX_Jobs_ScheduledStartDate ON Jobs(scheduledStartDate);
CREATE INDEX IX_Jobs_CustomerId ON Jobs(customerId);
CREATE INDEX IX_JobTechnicians_JobId ON JobTechnicians(jobId);
CREATE INDEX IX_JobTechnicians_TechnicianId ON JobTechnicians(technicianId);
CREATE INDEX IX_Inventory_Category ON Inventory(category);
CREATE INDEX IX_Inventory_SKU ON Inventory(sku);
CREATE INDEX IX_Estimates_Status ON Estimates(status);
CREATE INDEX IX_Estimates_CustomerId ON Estimates(customerId);
CREATE INDEX IX_Invoices_Status ON Invoices(status);
CREATE INDEX IX_Invoices_CustomerId ON Invoices(customerId);
CREATE INDEX IX_Payments_InvoiceId ON Payments(invoiceId);
CREATE INDEX IX_Timesheets_TechnicianId ON Timesheets(technicianId);
CREATE INDEX IX_Timesheets_Date ON Timesheets(date);
CREATE INDEX IX_DispatchSchedule_ScheduledDate ON DispatchSchedule(scheduledDate);
CREATE INDEX IX_DispatchSchedule_TechnicianId ON DispatchSchedule(technicianId);
CREATE INDEX IX_TechnicianLocations_TechnicianId ON TechnicianLocations(technicianId);
