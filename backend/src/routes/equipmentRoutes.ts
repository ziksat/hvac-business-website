import { Router } from 'express';
import { 
  getAllEquipment, 
  getEquipmentById, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment,
  getEquipmentDueForMaintenance
} from '../controllers/equipmentController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { equipmentValidation, idParam, paginationQuery } from '../middleware/validation';

const router = Router();

// All equipment routes require authentication
router.use(authenticate);

router.get('/', paginationQuery, getAllEquipment);
router.get('/due-maintenance', getEquipmentDueForMaintenance);
router.get('/:id', idParam, getEquipmentById);
router.post('/', equipmentValidation, createEquipment);
router.put('/:id', idParam, updateEquipment);
router.delete('/:id', idParam, authorizeAdmin, deleteEquipment);

export default router;
