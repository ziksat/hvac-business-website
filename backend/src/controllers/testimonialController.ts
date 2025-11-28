import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getPool, sql } from '../utils/database';

export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  const approvedOnly = req.query.approved === 'true';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const pool = await getPool();
    let query = 'SELECT * FROM Testimonials WHERE 1=1';
    
    if (approvedOnly) {
      query += ' AND isApproved = 1';
    }
    
    query += ' ORDER BY createdAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';

    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(query);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM Testimonials WHERE 1=1';
    if (approvedOnly) {
      countQuery += ' AND isApproved = 1';
    }
    const countResult = await pool.request().query(countQuery);

    res.json({
      testimonials: result.recordset,
      pagination: {
        page,
        limit,
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTestimonialById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Testimonials WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { customerName, customerEmail, content, rating, serviceType, customerId, isApproved } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('customerName', sql.NVarChar, customerName)
      .input('customerEmail', sql.NVarChar, customerEmail || null)
      .input('content', sql.NVarChar, content)
      .input('rating', sql.Int, rating)
      .input('serviceType', sql.NVarChar, serviceType || null)
      .input('customerId', sql.Int, customerId || null)
      .input('isApproved', sql.Bit, isApproved || false)
      .query(`
        INSERT INTO Testimonials (customerName, customerEmail, content, rating, serviceType, customerId, isApproved, createdAt)
        OUTPUT INSERTED.*
        VALUES (@customerName, @customerEmail, @content, @rating, @serviceType, @customerId, @isApproved, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { customerName, customerEmail, content, rating, serviceType, isApproved } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('customerName', sql.NVarChar, customerName)
      .input('customerEmail', sql.NVarChar, customerEmail || null)
      .input('content', sql.NVarChar, content)
      .input('rating', sql.Int, rating)
      .input('serviceType', sql.NVarChar, serviceType || null)
      .input('isApproved', sql.Bit, isApproved || false)
      .query(`
        UPDATE Testimonials 
        SET customerName = @customerName, customerEmail = @customerEmail, content = @content,
            rating = @rating, serviceType = @serviceType, isApproved = @isApproved, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const approveTestimonial = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('isApproved', sql.Bit, isApproved)
      .query(`
        UPDATE Testimonials 
        SET isApproved = @isApproved, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Approve testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Testimonials OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
