import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './admin/AdminLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BookService from './pages/BookService';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import CustomerManagement from './admin/CustomerManagement';
import ServiceManagement from './admin/ServiceManagement';
import BlogManagement from './admin/BlogManagement';
import TestimonialManagement from './admin/TestimonialManagement';
import ServiceRequestManagement from './admin/ServiceRequestManagement';
import Settings from './admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
// ServiceTitan-like feature imports
import DispatchBoard from './admin/DispatchBoard';
import JobManagement from './admin/JobManagement';
import TechnicianManagement from './admin/TechnicianManagement';
import InvoiceManagement from './admin/InvoiceManagement';
import InventoryManagement from './admin/InventoryManagement';
import EstimateManagement from './admin/EstimateManagement';
import Reports from './admin/Reports';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="book-service" element={<BookService />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="service-requests" element={<ServiceRequestManagement />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="testimonials" element={<TestimonialManagement />} />
        <Route path="settings" element={<Settings />} />
        {/* ServiceTitan-like features */}
        <Route path="dispatch" element={<DispatchBoard />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="technicians" element={<TechnicianManagement />} />
        <Route path="invoices" element={<InvoiceManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="estimates" element={<EstimateManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
