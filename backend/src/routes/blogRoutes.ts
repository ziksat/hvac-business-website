import { Router } from 'express';
import { 
  getAllBlogPosts, 
  getBlogPostBySlug, 
  getBlogPostById,
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from '../controllers/blogController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { blogPostValidation, idParam, paginationQuery } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', paginationQuery, getAllBlogPosts);
router.get('/slug/:slug', getBlogPostBySlug);
router.get('/:id', idParam, getBlogPostById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, blogPostValidation, createBlogPost);
router.put('/:id', authenticate, authorizeAdmin, idParam, updateBlogPost);
router.delete('/:id', authenticate, authorizeAdmin, idParam, deleteBlogPost);

export default router;
