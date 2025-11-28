import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getPool, sql } from '../utils/database';

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  const activeOnly = req.query.active === 'true';

  try {
    const pool = await getPool();
    let query = 'SELECT * FROM Services';
    if (activeOnly) {
      query += ' WHERE isActive = 1';
    }
    query += ' ORDER BY sortOrder ASC, name ASC';
    
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Services WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, description, shortDescription, price, duration, icon, image, isActive, sortOrder, features } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('shortDescription', sql.NVarChar, shortDescription || null)
      .input('price', sql.Decimal(10, 2), price)
      .input('duration', sql.Int, duration)
      .input('icon', sql.NVarChar, icon || null)
      .input('image', sql.NVarChar, image || null)
      .input('isActive', sql.Bit, isActive !== false)
      .input('sortOrder', sql.Int, sortOrder || 0)
      .input('features', sql.NVarChar, features ? JSON.stringify(features) : null)
      .query(`
        INSERT INTO Services (name, description, shortDescription, price, duration, icon, image, isActive, sortOrder, features, createdAt)
        OUTPUT INSERTED.*
        VALUES (@name, @description, @shortDescription, @price, @duration, @icon, @image, @isActive, @sortOrder, @features, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, shortDescription, price, duration, icon, image, isActive, sortOrder, features } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('shortDescription', sql.NVarChar, shortDescription || null)
      .input('price', sql.Decimal(10, 2), price)
      .input('duration', sql.Int, duration)
      .input('icon', sql.NVarChar, icon || null)
      .input('image', sql.NVarChar, image || null)
      .input('isActive', sql.Bit, isActive !== false)
      .input('sortOrder', sql.Int, sortOrder || 0)
      .input('features', sql.NVarChar, features ? JSON.stringify(features) : null)
      .query(`
        UPDATE Services 
        SET name = @name, description = @description, shortDescription = @shortDescription,
            price = @price, duration = @duration, icon = @icon, image = @image,
            isActive = @isActive, sortOrder = @sortOrder, features = @features, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Services OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
