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
  Equipment,
  Technician,
  TechniciansResponse,
  Job,
  JobsResponse,
  InventoryItem,
  InventoryResponse,
  Estimate,
  EstimatesResponse,
  Invoice,
  InvoicesResponse,
  Payment,
  PaymentsResponse,
  Timesheet,
  TimesheetsResponse,
  DispatchSchedule,
  DispatchScheduleResponse,
  DashboardStats,
  JobPart,
  JobLabor
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

  // =====================================================
  // ServiceTitan-like Features
  // =====================================================

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  // Technicians
  getTechnicians: async (page = 1, limit = 10, status = ''): Promise<TechniciansResponse> => {
    const response = await api.get<TechniciansResponse>('/technicians', {
      params: { page, limit, status: status || undefined },
    });
    return response.data;
  },

  getTechnicianById: async (id: number): Promise<Technician> => {
    const response = await api.get<Technician>(`/technicians/${id}`);
    return response.data;
  },

  createTechnician: async (data: Partial<Technician>): Promise<Technician> => {
    const response = await api.post<Technician>('/technicians', data);
    return response.data;
  },

  updateTechnician: async (id: number, data: Partial<Technician>): Promise<Technician> => {
    const response = await api.put<Technician>(`/technicians/${id}`, data);
    return response.data;
  },

  deleteTechnician: async (id: number): Promise<void> => {
    await api.delete(`/technicians/${id}`);
  },

  // Jobs
  getJobs: async (page = 1, limit = 10, status = '', technicianId?: number, customerId?: number, startDate?: string, endDate?: string): Promise<JobsResponse> => {
    const response = await api.get<JobsResponse>('/jobs', {
      params: { page, limit, status: status || undefined, technicianId, customerId, startDate, endDate },
    });
    return response.data;
  },

  getJobById: async (id: number): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: Partial<Job>): Promise<Job> => {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  updateJob: async (id: number, data: Partial<Job>): Promise<Job> => {
    const response = await api.put<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  updateJobStatus: async (id: number, status: string): Promise<Job> => {
    const response = await api.patch<Job>(`/jobs/${id}/status`, { status });
    return response.data;
  },

  deleteJob: async (id: number): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Job Technicians
  assignTechniciansToJob: async (jobId: number, technicianIds: number[]): Promise<void> => {
    await api.post(`/jobs/${jobId}/technicians`, { technicianIds });
  },

  removeTechnicianFromJob: async (jobId: number, technicianId: number): Promise<void> => {
    await api.delete(`/jobs/${jobId}/technicians/${technicianId}`);
  },

  // Job Parts
  addJobPart: async (jobId: number, data: Partial<JobPart>): Promise<JobPart> => {
    const response = await api.post<JobPart>(`/jobs/${jobId}/parts`, data);
    return response.data;
  },

  removeJobPart: async (jobId: number, partId: number): Promise<void> => {
    await api.delete(`/jobs/${jobId}/parts/${partId}`);
  },

  // Job Labor
  addJobLabor: async (jobId: number, data: Partial<JobLabor>): Promise<JobLabor> => {
    const response = await api.post<JobLabor>(`/jobs/${jobId}/labor`, data);
    return response.data;
  },

  removeJobLabor: async (jobId: number, laborId: number): Promise<void> => {
    await api.delete(`/jobs/${jobId}/labor/${laborId}`);
  },

  // Inventory
  getInventory: async (page = 1, limit = 10, category = '', search = ''): Promise<InventoryResponse> => {
    const response = await api.get<InventoryResponse>('/inventory', {
      params: { page, limit, category: category || undefined, search: search || undefined },
    });
    return response.data;
  },

  getInventoryById: async (id: number): Promise<InventoryItem> => {
    const response = await api.get<InventoryItem>(`/inventory/${id}`);
    return response.data;
  },

  createInventoryItem: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.post<InventoryItem>('/inventory', data);
    return response.data;
  },

  updateInventoryItem: async (id: number, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.put<InventoryItem>(`/inventory/${id}`, data);
    return response.data;
  },

  updateInventoryStock: async (id: number, quantity: number, type: 'add' | 'subtract'): Promise<InventoryItem> => {
    const response = await api.patch<InventoryItem>(`/inventory/${id}/stock`, { quantity, type });
    return response.data;
  },

  deleteInventoryItem: async (id: number): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },

  getInventoryCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/inventory/categories');
    return response.data;
  },

  getLowStockItems: async (): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>('/inventory/low-stock');
    return response.data;
  },

  // Estimates
  getEstimates: async (page = 1, limit = 10, status = '', customerId?: number): Promise<EstimatesResponse> => {
    const response = await api.get<EstimatesResponse>('/estimates', {
      params: { page, limit, status: status || undefined, customerId },
    });
    return response.data;
  },

  getEstimateById: async (id: number): Promise<Estimate> => {
    const response = await api.get<Estimate>(`/estimates/${id}`);
    return response.data;
  },

  createEstimate: async (data: Partial<Estimate>): Promise<Estimate> => {
    const response = await api.post<Estimate>('/estimates', data);
    return response.data;
  },

  updateEstimate: async (id: number, data: Partial<Estimate>): Promise<Estimate> => {
    const response = await api.put<Estimate>(`/estimates/${id}`, data);
    return response.data;
  },

  updateEstimateStatus: async (id: number, status: string): Promise<Estimate> => {
    const response = await api.patch<Estimate>(`/estimates/${id}/status`, { status });
    return response.data;
  },

  sendEstimate: async (id: number): Promise<void> => {
    await api.post(`/estimates/${id}/send`);
  },

  convertEstimateToJob: async (id: number): Promise<Job> => {
    const response = await api.post<Job>(`/estimates/${id}/convert-to-job`);
    return response.data;
  },

  deleteEstimate: async (id: number): Promise<void> => {
    await api.delete(`/estimates/${id}`);
  },

  // Invoices
  getInvoices: async (page = 1, limit = 10, status = '', customerId?: number): Promise<InvoicesResponse> => {
    const response = await api.get<InvoicesResponse>('/invoices', {
      params: { page, limit, status: status || undefined, customerId },
    });
    return response.data;
  },

  getInvoiceById: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.post<Invoice>('/invoices', data);
    return response.data;
  },

  createInvoiceFromJob: async (jobId: number): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/jobs/${jobId}/create-invoice`);
    return response.data;
  },

  updateInvoice: async (id: number, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${id}`, data);
    return response.data;
  },

  sendInvoice: async (id: number): Promise<void> => {
    await api.post(`/invoices/${id}/send`);
  },

  voidInvoice: async (id: number): Promise<void> => {
    await api.post(`/invoices/${id}/void`);
  },

  deleteInvoice: async (id: number): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },

  // Payments
  getPayments: async (page = 1, limit = 10, invoiceId?: number): Promise<PaymentsResponse> => {
    const response = await api.get<PaymentsResponse>('/payments', {
      params: { page, limit, invoiceId },
    });
    return response.data;
  },

  recordPayment: async (invoiceId: number, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post<Payment>(`/invoices/${invoiceId}/payments`, data);
    return response.data;
  },

  refundPayment: async (paymentId: number): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/${paymentId}/refund`);
    return response.data;
  },

  // Timesheets
  getTimesheets: async (page = 1, limit = 10, technicianId?: number, startDate?: string, endDate?: string, status = ''): Promise<TimesheetsResponse> => {
    const response = await api.get<TimesheetsResponse>('/timesheets', {
      params: { page, limit, technicianId, startDate, endDate, status: status || undefined },
    });
    return response.data;
  },

  createTimesheet: async (data: Partial<Timesheet>): Promise<Timesheet> => {
    const response = await api.post<Timesheet>('/timesheets', data);
    return response.data;
  },

  updateTimesheet: async (id: number, data: Partial<Timesheet>): Promise<Timesheet> => {
    const response = await api.put<Timesheet>(`/timesheets/${id}`, data);
    return response.data;
  },

  approveTimesheet: async (id: number): Promise<Timesheet> => {
    const response = await api.post<Timesheet>(`/timesheets/${id}/approve`);
    return response.data;
  },

  rejectTimesheet: async (id: number, reason?: string): Promise<Timesheet> => {
    const response = await api.post<Timesheet>(`/timesheets/${id}/reject`, { reason });
    return response.data;
  },

  clockIn: async (technicianId: number, jobId?: number): Promise<Timesheet> => {
    const response = await api.post<Timesheet>('/timesheets/clock-in', { technicianId, jobId });
    return response.data;
  },

  clockOut: async (timesheetId: number): Promise<Timesheet> => {
    const response = await api.post<Timesheet>(`/timesheets/${timesheetId}/clock-out`);
    return response.data;
  },

  // Dispatch Schedule
  getDispatchSchedule: async (date: string, technicianId?: number): Promise<DispatchScheduleResponse> => {
    const response = await api.get<DispatchScheduleResponse>('/dispatch', {
      params: { date, technicianId },
    });
    return response.data;
  },

  createDispatchSchedule: async (data: Partial<DispatchSchedule>): Promise<DispatchSchedule> => {
    const response = await api.post<DispatchSchedule>('/dispatch', data);
    return response.data;
  },

  updateDispatchSchedule: async (id: number, data: Partial<DispatchSchedule>): Promise<DispatchSchedule> => {
    const response = await api.put<DispatchSchedule>(`/dispatch/${id}`, data);
    return response.data;
  },

  updateDispatchStatus: async (id: number, status: string): Promise<DispatchSchedule> => {
    const response = await api.patch<DispatchSchedule>(`/dispatch/${id}/status`, { status });
    return response.data;
  },

  deleteDispatchSchedule: async (id: number): Promise<void> => {
    await api.delete(`/dispatch/${id}`);
  },

  dispatchJob: async (jobId: number, technicianId: number, scheduledDate: string, startTime: string, endTime: string): Promise<DispatchSchedule> => {
    const response = await api.post<DispatchSchedule>('/dispatch/assign', {
      jobId,
      technicianId,
      scheduledDate,
      startTime,
      endTime,
    });
    return response.data;
  },

  // Reports
  getRevenueReport: async (startDate: string, endDate: string, groupBy: 'day' | 'week' | 'month' = 'day'): Promise<{ data: { date: string; revenue: number; cost: number; profit: number }[] }> => {
    const response = await api.get('/reports/revenue', {
      params: { startDate, endDate, groupBy },
    });
    return response.data;
  },

  getTechnicianPerformance: async (startDate: string, endDate: string): Promise<{ data: { technicianId: number; technicianName: string; jobsCompleted: number; revenue: number; avgRating: number; hoursWorked: number }[] }> => {
    const response = await api.get('/reports/technician-performance', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getJobsReport: async (startDate: string, endDate: string): Promise<{ data: { status: string; count: number }[] }> => {
    const response = await api.get('/reports/jobs', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getServiceReport: async (startDate: string, endDate: string): Promise<{ data: { serviceType: string; count: number; revenue: number }[] }> => {
    const response = await api.get('/reports/services', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
