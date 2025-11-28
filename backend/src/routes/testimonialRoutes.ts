import { Router } from 'express';
import { 
  getAllTestimonials, 
  getTestimonialById, 
  createTestimonial, 
  updateTestimonial, 
  approveTestimonial,
  deleteTestimonial 
} from '../controllers/testimonialController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { testimonialValidation, idParam, paginationQuery } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', paginationQuery, getAllTestimonials);
router.get('/:id', idParam, getTestimonialById);

// Customer can submit testimonials (no auth required for submission)
router.post('/', testimonialValidation, createTestimonial);

// Admin routes
router.put('/:id', authenticate, authorizeAdmin, idParam, updateTestimonial);
router.patch('/:id/approve', authenticate, authorizeAdmin, idParam, approveTestimonial);
router.delete('/:id', authenticate, authorizeAdmin, idParam, deleteTestimonial);

export default router;
