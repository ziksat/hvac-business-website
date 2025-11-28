import api from './api';
import { 
  Customer, 
  CustomersResponse, 
  Service, 
  BlogPost, 
  BlogPostsResponse,
  Testimonial, 
  TestimonialsResponse,
  ServiceRequest,
  ServiceRequestsResponse,
  Settings,
  PageContent,
  Equipment
} from '../types';

export const adminService = {
  // Customers
  getCustomers: async (page = 1, limit = 10, search = ''): Promise<CustomersResponse> => {
    const response = await api.get<CustomersResponse>('/customers', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  updateCustomer: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },

  createService: async (data: Partial<Service>): Promise<Service> => {
    const response = await api.post<Service>('/services', data);
    return response.data;
  },

  updateService: async (id: number, data: Partial<Service>): Promise<Service> => {
    const response = await api.put<Service>(`/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },

  // Blog
  getBlogPosts: async (page = 1, limit = 10): Promise<BlogPostsResponse> => {
    const response = await api.get<BlogPostsResponse>('/blog', {
      params: { page, limit },
    });
    return response.data;
  },

  getBlogPostById: async (id: number): Promise<BlogPost> => {
    const response = await api.get<BlogPost>(`/blog/${id}`);
    return response.data;
  },

  createBlogPost: async (data: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.post<BlogPost>('/blog', data);
    return response.data;
  },

  updateBlogPost: async (id: number, data: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put<BlogPost>(`/blog/${id}`, data);
    return response.data;
  },

  deleteBlogPost: async (id: number): Promise<void> => {
    await api.delete(`/blog/${id}`);
  },

  // Testimonials
  getTestimonials: async (page = 1, limit = 10): Promise<TestimonialsResponse> => {
    const response = await api.get<TestimonialsResponse>('/testimonials', {
      params: { page, limit },
    });
    return response.data;
  },

  updateTestimonial: async (id: number, data: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await api.put<Testimonial>(`/testimonials/${id}`, data);
    return response.data;
  },

  approveTestimonial: async (id: number, isApproved: boolean): Promise<Testimonial> => {
    const response = await api.patch<Testimonial>(`/testimonials/${id}/approve`, { isApproved });
    return response.data;
  },

  deleteTestimonial: async (id: number): Promise<void> => {
    await api.delete(`/testimonials/${id}`);
  },

  // Service Requests
  getServiceRequests: async (page = 1, limit = 10, status = ''): Promise<ServiceRequestsResponse> => {
    const response = await api.get<ServiceRequestsResponse>('/service-requests', {
      params: { page, limit, status: status || undefined },
    });
    return response.data;
  },

  updateServiceRequest: async (id: number, data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    const response = await api.patch<ServiceRequest>(`/service-requests/${id}`, data);
    return response.data;
  },

  deleteServiceRequest: async (id: number): Promise<void> => {
    await api.delete(`/service-requests/${id}`);
  },

  // Settings
  getSettings: async (): Promise<Settings> => {
    const response = await api.get<Settings>('/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<Settings>): Promise<void> => {
    await api.put('/settings', data);
  },

  // Page Content
  getAllPageContent: async (): Promise<PageContent[]> => {
    const response = await api.get<PageContent[]>('/settings/pages');
    return response.data;
  },

  updatePageContent: async (pageId: string, data: Partial<PageContent>): Promise<PageContent> => {
    const response = await api.put<PageContent>(`/settings/pages/${pageId}`, data);
    return response.data;
  },

  // Equipment
  getEquipment: async (customerId?: number): Promise<{ equipment: Equipment[] }> => {
    const response = await api.get<{ equipment: Equipment[] }>('/equipment', {
      params: { customerId },
    });
    return response.data;
  },

  createEquipment: async (data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.post<Equipment>('/equipment', data);
    return response.data;
  },

  updateEquipment: async (id: number, data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.put<Equipment>(`/equipment/${id}`, data);
    return response.data;
  },

  deleteEquipment: async (id: number): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  },

  // Email
  sendReminder: async (data: { to: string; customerName: string; subject: string; message: string }): Promise<void> => {
    await api.post('/email/send-reminder', data);
  },
};
