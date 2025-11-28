export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  serviceCount?: number;
  equipment?: Equipment[];
  serviceHistory?: ServiceHistory[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  duration: number;
  icon?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  features?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Equipment {
  id: number;
  customerId: number;
  type: string;
  brand: string;
  model: string;
  serialNumber?: string;
  installationDate: string;
  warrantyExpiry?: string;
  maintenanceDue?: string;
  notes?: string;
  customerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceHistory {
  id: number;
  customerId: number;
  serviceId?: number;
  serviceName?: string;
  serviceDate: string;
  technician: string;
  notes?: string;
  cost: number;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  isPublished: boolean;
  publishDate?: string;
  tags?: string[];
  authorId?: number;
  authorFirstName?: string;
  authorLastName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: number;
  customerName: string;
  customerEmail?: string;
  content: string;
  rating: number;
  serviceType?: string;
  customerId?: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceRequest {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  serviceType: string;
  preferredDate: string;
  preferredTime?: string;
  message?: string;
  isEmergency: boolean;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  assignedTechnician?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Settings {
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  businessHours: string;
  emergencyPhone: string;
  serviceAreas: string;
  licenseNumber: string;
  insuranceInfo: string;
  facebookUrl: string;
  googleMapsUrl: string;
  metaDescription: string;
  [key: string]: string;
}

export interface PageContent {
  id: number;
  pageId: string;
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  sections?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

// =====================================================
// ServiceTitan-like Feature Types
// =====================================================

export interface Technician {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  certifications?: string[];
  skills?: string[];
  hourlyRate?: number;
  status: 'active' | 'inactive' | 'on_leave';
  color?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Job {
  id: number;
  jobNumber: string;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceRequestId?: number;
  serviceType: string;
  description?: string;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  status: 'scheduled' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  scheduledStartDate: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  accessNotes?: string;
  customerNotes?: string;
  technicianNotes?: string;
  completionNotes?: string;
  customerSignature?: string;
  signedAt?: string;
  tags?: string[];
  technicians?: Technician[];
  parts?: JobPart[];
  labor?: JobLabor[];
  createdAt: string;
  updatedAt?: string;
}

export interface JobPart {
  id: number;
  jobId: number;
  inventoryId: number;
  inventoryName?: string;
  inventorySku?: string;
  quantity: number;
  unitPrice: number;
  cost: number;
  notes?: string;
  addedAt: string;
}

export interface JobLabor {
  id: number;
  jobId: number;
  technicianId: number;
  technicianName?: string;
  laborType: string;
  hours: number;
  rate: number;
  description?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  unitCost: number;
  sellingPrice: number;
  quantityOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  location?: string;
  supplier?: string;
  supplierPartNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Estimate {
  id: number;
  estimateNumber: string;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  jobId?: number;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'viewed' | 'approved' | 'declined' | 'expired';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
  total: number;
  validUntil?: string;
  notes?: string;
  terms?: string;
  customerSignature?: string;
  signedAt?: string;
  sentAt?: string;
  approvedAt?: string;
  items?: EstimateItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface EstimateItem {
  id: number;
  estimateId: number;
  itemType: 'service' | 'part' | 'labor' | 'discount';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  inventoryId?: number;
  serviceId?: number;
  sortOrder: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  jobId?: number;
  estimateId?: number;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
  total: number;
  amountPaid: number;
  balanceDue: number;
  dueDate?: string;
  notes?: string;
  terms?: string;
  sentAt?: string;
  paidAt?: string;
  items?: InvoiceItem[];
  payments?: Payment[];
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  itemType: 'service' | 'part' | 'labor' | 'discount';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  inventoryId?: number;
  serviceId?: number;
  sortOrder: number;
}

export interface Payment {
  id: number;
  invoiceId: number;
  paymentNumber: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'other';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  processedBy?: string;
  createdAt: string;
}

export interface Timesheet {
  id: number;
  technicianId: number;
  technicianName?: string;
  jobId?: number;
  jobNumber?: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakMinutes: number;
  totalHours?: number;
  type: 'regular' | 'overtime' | 'travel' | 'training';
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DispatchSchedule {
  id: number;
  jobId: number;
  jobNumber?: string;
  technicianId: number;
  technicianName?: string;
  customerName?: string;
  serviceType?: string;
  address?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
  notes?: string;
  dispatchedAt?: string;
  dispatchedBy?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TechnicianLocation {
  id: number;
  technicianId: number;
  technicianName?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  recordedAt: string;
}

// Dashboard Stats for ServiceTitan features
export interface DashboardStats {
  totalCustomers: number;
  activeJobs: number;
  pendingRequests: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  technicianStats: {
    active: number;
    onJob: number;
    available: number;
  };
  jobStats: {
    scheduled: number;
    inProgress: number;
    completedToday: number;
    completedWeek: number;
  };
  invoiceStats: {
    unpaid: number;
    overdue: number;
    paidThisMonth: number;
  };
}

export interface PaginatedResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomersResponse extends PaginatedResponse<Customer> {
  customers: Customer[];
}

export interface BlogPostsResponse extends PaginatedResponse<BlogPost> {
  posts: BlogPost[];
}

export interface TestimonialsResponse extends PaginatedResponse<Testimonial> {
  testimonials: Testimonial[];
}

export interface ServiceRequestsResponse extends PaginatedResponse<ServiceRequest> {
  requests: ServiceRequest[];
}

export interface TechniciansResponse extends PaginatedResponse<Technician> {
  technicians: Technician[];
}

export interface JobsResponse extends PaginatedResponse<Job> {
  jobs: Job[];
}

export interface InventoryResponse extends PaginatedResponse<InventoryItem> {
  items: InventoryItem[];
}

export interface EstimatesResponse extends PaginatedResponse<Estimate> {
  estimates: Estimate[];
}

export interface InvoicesResponse extends PaginatedResponse<Invoice> {
  invoices: Invoice[];
}

export interface PaymentsResponse extends PaginatedResponse<Payment> {
  payments: Payment[];
}

export interface TimesheetsResponse extends PaginatedResponse<Timesheet> {
  timesheets: Timesheet[];
}

export interface DispatchScheduleResponse extends PaginatedResponse<DispatchSchedule> {
  schedules: DispatchSchedule[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
