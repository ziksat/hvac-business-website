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
