import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getPool, sql } from '../utils/database';
import { sendEmail } from '../utils/email';

export const getAllServiceRequests = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;
  const offset = (page - 1) * limit;

  try {
    const pool = await getPool();
    let query = 'SELECT * FROM ServiceRequests WHERE 1=1';
    const request = pool.request();
    
    if (status) {
      query += ' AND status = @status';
      request.input('status', sql.NVarChar, status);
    }
    
    query += ' ORDER BY preferredDate ASC, createdAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);

    const result = await request.query(query);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM ServiceRequests WHERE 1=1';
    const countRequest = pool.request();
    if (status) {
      countQuery += ' AND status = @status';
      countRequest.input('status', sql.NVarChar, status);
    }
    const countResult = await countRequest.query(countQuery);

    res.json({
      requests: result.recordset,
      pagination: {
        page,
        limit,
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getServiceRequestById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ServiceRequests WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get service request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createServiceRequest = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { 
    customerName, email, phone, address, city, state, zipCode,
    serviceType, preferredDate, preferredTime, message, isEmergency 
  } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('customerName', sql.NVarChar, customerName)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('address', sql.NVarChar, address || null)
      .input('city', sql.NVarChar, city || null)
      .input('state', sql.NVarChar, state || null)
      .input('zipCode', sql.NVarChar, zipCode || null)
      .input('serviceType', sql.NVarChar, serviceType)
      .input('preferredDate', sql.DateTime, new Date(preferredDate))
      .input('preferredTime', sql.NVarChar, preferredTime || null)
      .input('message', sql.NVarChar, message || null)
      .input('isEmergency', sql.Bit, isEmergency || false)
      .input('status', sql.NVarChar, 'pending')
      .query(`
        INSERT INTO ServiceRequests (customerName, email, phone, address, city, state, zipCode, 
                                     serviceType, preferredDate, preferredTime, message, isEmergency, status, createdAt)
        OUTPUT INSERTED.*
        VALUES (@customerName, @email, @phone, @address, @city, @state, @zipCode,
                @serviceType, @preferredDate, @preferredTime, @message, @isEmergency, @status, GETDATE())
      `);

    const serviceRequest = result.recordset[0];

    // Send confirmation email to customer
    await sendEmail({
      to: email,
      subject: 'Service Request Received - HVAC Company',
      html: `
        <h2>Thank you for your service request!</h2>
        <p>Dear ${customerName},</p>
        <p>We have received your request for ${serviceType}.</p>
        <p><strong>Requested Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
        ${preferredTime ? `<p><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
        <p>Our team will contact you shortly to confirm your appointment.</p>
        <p>If you need immediate assistance, please call us at (555) 123-4567.</p>
        <p>Thank you for choosing us!</p>
      `,
    });

    res.status(201).json(serviceRequest);
  } catch (error) {
    console.error('Create service request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateServiceRequestStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, notes, assignedTechnician, scheduledDate } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar, status)
      .input('notes', sql.NVarChar, notes || null)
      .input('assignedTechnician', sql.NVarChar, assignedTechnician || null)
      .input('scheduledDate', sql.DateTime, scheduledDate ? new Date(scheduledDate) : null)
      .query(`
        UPDATE ServiceRequests 
        SET status = @status, notes = @notes, assignedTechnician = @assignedTechnician,
            scheduledDate = @scheduledDate, updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }

    const serviceRequest = result.recordset[0];

    // Send status update email
    if (status === 'confirmed' && scheduledDate) {
      await sendEmail({
        to: serviceRequest.email,
        subject: 'Service Appointment Confirmed - HVAC Company',
        html: `
          <h2>Your appointment is confirmed!</h2>
          <p>Dear ${serviceRequest.customerName},</p>
          <p>Your ${serviceRequest.serviceType} appointment has been confirmed.</p>
          <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
          ${assignedTechnician ? `<p><strong>Technician:</strong> ${assignedTechnician}</p>` : ''}
          <p>If you need to reschedule, please call us at (555) 123-4567.</p>
        `,
      });
    }

    res.json(serviceRequest);
  } catch (error) {
    console.error('Update service request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteServiceRequest = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ServiceRequests OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }

    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    console.error('Delete service request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
