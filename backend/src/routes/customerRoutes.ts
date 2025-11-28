import { Router } from 'express';
import { 
  getAllCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  addServiceHistory,
  getCustomersDueForMaintenance
} from '../controllers/customerController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { customerValidation, idParam, searchQuery } from '../middleware/validation';

const router = Router();

// All customer routes require authentication
router.use(authenticate);

router.get('/', searchQuery, getAllCustomers);
router.get('/due-maintenance', getCustomersDueForMaintenance);
router.get('/:id', idParam, getCustomerById);
router.post('/', customerValidation, createCustomer);
router.put('/:id', idParam, customerValidation, updateCustomer);
router.delete('/:id', idParam, authorizeAdmin, deleteCustomer);
router.post('/service-history', addServiceHistory);

export default router;
