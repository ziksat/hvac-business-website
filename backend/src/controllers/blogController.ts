import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getPool, sql } from '../utils/database';

export const getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const publishedOnly = req.query.published === 'true';
  const offset = (page - 1) * limit;

  try {
    const pool = await getPool();
    let query = `
      SELECT b.*, u.firstName as authorFirstName, u.lastName as authorLastName
      FROM BlogPosts b
      LEFT JOIN Users u ON b.authorId = u.id
      WHERE 1=1
    `;
    
    if (publishedOnly) {
      query += ` AND b.isPublished = 1 AND b.publishDate <= GETDATE()`;
    }
    
    query += ` ORDER BY b.publishDate DESC, b.createdAt DESC
               OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(query);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM BlogPosts WHERE 1=1';
    if (publishedOnly) {
      countQuery += ` AND isPublished = 1 AND publishDate <= GETDATE()`;
    }
    const countResult = await pool.request().query(countQuery);

    res.json({
      posts: result.recordset,
      pagination: {
        page,
        limit,
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBlogPostBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('slug', sql.NVarChar, slug)
      .query(`
        SELECT b.*, u.firstName as authorFirstName, u.lastName as authorLastName
        FROM BlogPosts b
        LEFT JOIN Users u ON b.authorId = u.id
        WHERE b.slug = @slug AND b.isPublished = 1
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBlogPostById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT b.*, u.firstName as authorFirstName, u.lastName as authorLastName
        FROM BlogPosts b
        LEFT JOIN Users u ON b.authorId = u.id
        WHERE b.id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createBlogPost = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, slug, content, excerpt, featuredImage, isPublished, publishDate, tags, authorId } = req.body;

  try {
    const pool = await getPool();
    
    // Generate slug if not provided
    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('slug', sql.NVarChar, postSlug)
      .input('content', sql.NVarChar, content)
      .input('excerpt', sql.NVarChar, excerpt)
      .input('featuredImage', sql.NVarChar, featuredImage || null)
      .input('isPublished', sql.Bit, isPublished || false)
      .input('publishDate', sql.DateTime, publishDate ? new Date(publishDate) : null)
      .input('tags', sql.NVarChar, tags ? JSON.stringify(tags) : null)
      .input('authorId', sql.Int, authorId)
      .query(`
        INSERT INTO BlogPosts (title, slug, content, excerpt, featuredImage, isPublished, publishDate, tags, authorId, createdAt)
        OUTPUT INSERTED.*
        VALUES (@title, @slug, @content, @excerpt, @featuredImage, @isPublished, @publishDate, @tags, @authorId, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateBlogPost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, slug, content, excerpt, featuredImage, isPublished, publishDate, tags } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, title)
      .input('slug', sql.NVarChar, slug)
      .input('content', sql.NVarChar, content)
      .input('excerpt', sql.NVarChar, excerpt)
      .input('featuredImage', sql.NVarChar, featuredImage || null)
      .input('isPublished', sql.Bit, isPublished || false)
      .input('publishDate', sql.DateTime, publishDate ? new Date(publishDate) : null)
      .input('tags', sql.NVarChar, tags ? JSON.stringify(tags) : null)
      .query(`
        UPDATE BlogPosts 
        SET title = @title, slug = @slug, content = @content, excerpt = @excerpt,
            featuredImage = @featuredImage, isPublished = @isPublished, 
            publishDate = @publishDate, tags = @tags, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteBlogPost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM BlogPosts OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
