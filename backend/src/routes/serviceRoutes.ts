import { Router } from 'express';
import { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { serviceValidation, idParam } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', idParam, getServiceById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, serviceValidation, createService);
router.put('/:id', authenticate, authorizeAdmin, idParam, serviceValidation, updateService);
router.delete('/:id', authenticate, authorizeAdmin, idParam, deleteService);

export default router;
