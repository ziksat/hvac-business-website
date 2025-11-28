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

export interface AuthResponse {
  token: string;
  user: User;
}
