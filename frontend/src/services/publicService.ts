import api from './api';
import { Service, BlogPost, BlogPostsResponse, Testimonial, TestimonialsResponse, Settings, PageContent, InventoryItem } from '../types';

interface PartsResponse {
  items: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const publicService = {
  // Services
  getServices: async (activeOnly = true): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services', { params: { active: activeOnly } });
    return response.data;
  },

  getServiceById: async (id: number): Promise<Service> => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  // Blog
  getBlogPosts: async (page = 1, limit = 10): Promise<BlogPostsResponse> => {
    const response = await api.get<BlogPostsResponse>('/blog', {
      params: { page, limit, published: true },
    });
    return response.data;
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await api.get<BlogPost>(`/blog/slug/${slug}`);
    return response.data;
  },

  // Testimonials
  getTestimonials: async (page = 1, limit = 10): Promise<TestimonialsResponse> => {
    const response = await api.get<TestimonialsResponse>('/testimonials', {
      params: { page, limit, approved: true },
    });
    return response.data;
  },

  submitTestimonial: async (data: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await api.post<Testimonial>('/testimonials', data);
    return response.data;
  },

  // Service Requests
  submitServiceRequest: async (data: Record<string, unknown>): Promise<void> => {
    await api.post('/service-requests', data);
  },

  // Contact
  submitContactForm: async (data: Record<string, unknown>): Promise<void> => {
    await api.post('/email/contact', data);
  },

  // Settings
  getSettings: async (): Promise<Settings> => {
    const response = await api.get<Settings>('/settings');
    return response.data;
  },

  // Page Content
  getPageContent: async (pageId: string): Promise<PageContent> => {
    const response = await api.get<PageContent>(`/settings/pages/${pageId}`);
    return response.data;
  },

  // Parts & Supplies (Public inventory)
  getParts: async (page = 1, limit = 12, category = '', search = ''): Promise<PartsResponse> => {
    const response = await api.get<PartsResponse>('/parts', {
      params: { page, limit, category, search, active: true },
    });
    return response.data;
  },

  getPartCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/parts/categories');
    return response.data;
  },
};
