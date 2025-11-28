import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getPool, sql } from '../utils/database';

export const getAllEquipment = async (req: Request, res: Response): Promise<void> => {
  const customerId = req.query.customerId as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const pool = await getPool();
    let query = `
      SELECT e.*, c.firstName + ' ' + c.lastName as customerName
      FROM Equipment e
      LEFT JOIN Customers c ON e.customerId = c.id
      WHERE 1=1
    `;
    const request = pool.request();

    if (customerId) {
      query += ' AND e.customerId = @customerId';
      request.input('customerId', sql.Int, customerId);
    }

    query += ' ORDER BY e.createdAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);

    const result = await request.query(query);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM Equipment WHERE 1=1';
    const countRequest = pool.request();
    if (customerId) {
      countQuery += ' AND customerId = @customerId';
      countRequest.input('customerId', sql.Int, customerId);
    }
    const countResult = await countRequest.query(countQuery);

    res.json({
      equipment: result.recordset,
      pagination: {
        page,
        limit,
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT e.*, c.firstName + ' ' + c.lastName as customerName
        FROM Equipment e
        LEFT JOIN Customers c ON e.customerId = c.id
        WHERE e.id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createEquipment = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { customerId, type, brand, model, serialNumber, installationDate, warrantyExpiry, maintenanceDue, notes } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('customerId', sql.Int, customerId)
      .input('type', sql.NVarChar, type)
      .input('brand', sql.NVarChar, brand)
      .input('model', sql.NVarChar, model)
      .input('serialNumber', sql.NVarChar, serialNumber || null)
      .input('installationDate', sql.DateTime, new Date(installationDate))
      .input('warrantyExpiry', sql.DateTime, warrantyExpiry ? new Date(warrantyExpiry) : null)
      .input('maintenanceDue', sql.DateTime, maintenanceDue ? new Date(maintenanceDue) : null)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        INSERT INTO Equipment (customerId, type, brand, model, serialNumber, installationDate, warrantyExpiry, maintenanceDue, notes, createdAt)
        OUTPUT INSERTED.*
        VALUES (@customerId, @type, @brand, @model, @serialNumber, @installationDate, @warrantyExpiry, @maintenanceDue, @notes, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { customerId, type, brand, model, serialNumber, installationDate, warrantyExpiry, maintenanceDue, notes } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('customerId', sql.Int, customerId)
      .input('type', sql.NVarChar, type)
      .input('brand', sql.NVarChar, brand)
      .input('model', sql.NVarChar, model)
      .input('serialNumber', sql.NVarChar, serialNumber || null)
      .input('installationDate', sql.DateTime, new Date(installationDate))
      .input('warrantyExpiry', sql.DateTime, warrantyExpiry ? new Date(warrantyExpiry) : null)
      .input('maintenanceDue', sql.DateTime, maintenanceDue ? new Date(maintenanceDue) : null)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        UPDATE Equipment 
        SET customerId = @customerId, type = @type, brand = @brand, model = @model,
            serialNumber = @serialNumber, installationDate = @installationDate,
            warrantyExpiry = @warrantyExpiry, maintenanceDue = @maintenanceDue,
            notes = @notes, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Equipment OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEquipmentDueForMaintenance = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`
        SELECT e.*, c.firstName + ' ' + c.lastName as customerName, c.email, c.phone
        FROM Equipment e
        INNER JOIN Customers c ON e.customerId = c.id
        WHERE e.maintenanceDue <= DATEADD(day, 30, GETDATE())
        ORDER BY e.maintenanceDue ASC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Get equipment due for maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
