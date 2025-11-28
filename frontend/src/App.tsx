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
        <Route path="blog" element={<BlogManagement />} />
        <Route path="testimonials" element={<TestimonialManagement />} />
        <Route path="service-requests" element={<ServiceRequestManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
