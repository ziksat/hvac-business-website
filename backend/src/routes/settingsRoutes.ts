import { Router } from 'express';
import { 
  getSettings, 
  updateSettings, 
  getSetting,
  getPageContent,
  updatePageContent,
  getAllPageContent
} from '../controllers/settingsController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Public route for getting page content
router.get('/pages', getAllPageContent);
router.get('/pages/:pageId', getPageContent);

// Public settings route for frontend
router.get('/', getSettings);
router.get('/:key', getSetting);

// Admin routes
router.put('/', authenticate, authorizeAdmin, updateSettings);
router.put('/pages/:pageId', authenticate, authorizeAdmin, updatePageContent);

export default router;
