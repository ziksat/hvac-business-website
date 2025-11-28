import { Router } from 'express';
import { 
  getAllServiceRequests, 
  getServiceRequestById, 
  createServiceRequest, 
  updateServiceRequestStatus, 
  deleteServiceRequest 
} from '../controllers/serviceRequestController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { serviceRequestValidation, idParam, paginationQuery } from '../middleware/validation';

const router = Router();

// Public route - customers can submit service requests
router.post('/', serviceRequestValidation, createServiceRequest);

// Admin routes
router.get('/', authenticate, paginationQuery, getAllServiceRequests);
router.get('/:id', authenticate, idParam, getServiceRequestById);
router.patch('/:id', authenticate, idParam, updateServiceRequestStatus);
router.delete('/:id', authenticate, authorizeAdmin, idParam, deleteServiceRequest);

export default router;
