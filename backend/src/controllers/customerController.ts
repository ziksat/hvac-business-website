import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getPool, sql } from '../utils/database';

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string || '';
  const offset = (page - 1) * limit;

  try {
    const pool = await getPool();
    
    let query = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM ServiceHistory WHERE customerId = c.id) as serviceCount
      FROM Customers c
      WHERE 1=1
    `;
    
    const request = pool.request();
    
    if (search) {
      query += ` AND (c.firstName LIKE @search OR c.lastName LIKE @search OR c.email LIKE @search OR c.phone LIKE @search)`;
      request.input('search', sql.NVarChar, `%${search}%`);
    }
    
    query += ` ORDER BY c.createdAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);

    const result = await request.query(query);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM Customers WHERE 1=1';
    const countRequest = pool.request();
    if (search) {
      countQuery += ` AND (firstName LIKE @search OR lastName LIKE @search OR email LIKE @search OR phone LIKE @search)`;
      countRequest.input('search', sql.NVarChar, `%${search}%`);
    }
    const countResult = await countRequest.query(countQuery);

    res.json({
      customers: result.recordset,
      pagination: {
        page,
        limit,
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Customers WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Get customer's equipment
    const equipment = await pool.request()
      .input('customerId', sql.Int, id)
      .query('SELECT * FROM Equipment WHERE customerId = @customerId');

    // Get service history
    const serviceHistory = await pool.request()
      .input('customerId', sql.Int, id)
      .query(`
        SELECT sh.*, s.name as serviceName 
        FROM ServiceHistory sh
        LEFT JOIN Services s ON sh.serviceId = s.id
        WHERE sh.customerId = @customerId
        ORDER BY sh.serviceDate DESC
      `);

    res.json({
      ...result.recordset[0],
      equipment: equipment.recordset,
      serviceHistory: serviceHistory.recordset,
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { firstName, lastName, email, phone, address, city, state, zipCode, notes } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('address', sql.NVarChar, address)
      .input('city', sql.NVarChar, city)
      .input('state', sql.NVarChar, state)
      .input('zipCode', sql.NVarChar, zipCode)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        INSERT INTO Customers (firstName, lastName, email, phone, address, city, state, zipCode, notes, createdAt)
        OUTPUT INSERTED.*
        VALUES (@firstName, @lastName, @email, @phone, @address, @city, @state, @zipCode, @notes, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address, city, state, zipCode, notes } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('address', sql.NVarChar, address)
      .input('city', sql.NVarChar, city)
      .input('state', sql.NVarChar, state)
      .input('zipCode', sql.NVarChar, zipCode)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        UPDATE Customers 
        SET firstName = @firstName, lastName = @lastName, email = @email, 
            phone = @phone, address = @address, city = @city, 
            state = @state, zipCode = @zipCode, notes = @notes, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Customers OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addServiceHistory = async (req: Request, res: Response): Promise<void> => {
  const { customerId, serviceId, serviceDate, technician, notes, cost } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('customerId', sql.Int, customerId)
      .input('serviceId', sql.Int, serviceId)
      .input('serviceDate', sql.DateTime, new Date(serviceDate))
      .input('technician', sql.NVarChar, technician)
      .input('notes', sql.NVarChar, notes || null)
      .input('cost', sql.Decimal(10, 2), cost)
      .query(`
        INSERT INTO ServiceHistory (customerId, serviceId, serviceDate, technician, notes, cost, createdAt)
        OUTPUT INSERTED.*
        VALUES (@customerId, @serviceId, @serviceDate, @technician, @notes, @cost, GETDATE())
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Add service history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCustomersDueForMaintenance = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query(`
        SELECT DISTINCT c.*, 
          MAX(sh.serviceDate) as lastServiceDate,
          e.type as equipmentType
        FROM Customers c
        INNER JOIN Equipment e ON e.customerId = c.id
        LEFT JOIN ServiceHistory sh ON sh.customerId = c.id
        WHERE e.maintenanceDue <= GETDATE() 
          OR DATEDIFF(day, sh.serviceDate, GETDATE()) >= 365
        GROUP BY c.id, c.firstName, c.lastName, c.email, c.phone, 
                 c.address, c.city, c.state, c.zipCode, c.notes,
                 c.createdAt, c.updatedAt, e.type
        ORDER BY lastServiceDate ASC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Get customers due for maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
