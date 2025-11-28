import { Request, Response } from 'express';
import { getPool, sql } from '../utils/database';

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Settings');

    // Convert array of settings to object
    const settings: Record<string, string> = {};
    for (const row of result.recordset) {
      settings[row.key] = row.value;
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const settings = req.body;

  try {
    const pool = await getPool();

    for (const [key, value] of Object.entries(settings)) {
      await pool.request()
        .input('key', sql.NVarChar, key)
        .input('value', sql.NVarChar, String(value))
        .query(`
          MERGE Settings AS target
          USING (SELECT @key AS [key], @value AS value) AS source
          ON target.[key] = source.[key]
          WHEN MATCHED THEN UPDATE SET value = source.value, updatedAt = GETDATE()
          WHEN NOT MATCHED THEN INSERT ([key], value, createdAt) VALUES (source.[key], source.value, GETDATE());
        `);
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSetting = async (req: Request, res: Response): Promise<void> => {
  const { key } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('key', sql.NVarChar, key)
      .query('SELECT value FROM Settings WHERE [key] = @key');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }

    res.json({ [key]: result.recordset[0].value });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Page content management
export const getPageContent = async (req: Request, res: Response): Promise<void> => {
  const { pageId } = req.params;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('pageId', sql.NVarChar, pageId)
      .query('SELECT * FROM PageContent WHERE pageId = @pageId');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Page content not found' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePageContent = async (req: Request, res: Response): Promise<void> => {
  const { pageId } = req.params;
  const { title, content, metaTitle, metaDescription, sections } = req.body;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('pageId', sql.NVarChar, pageId)
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content || null)
      .input('metaTitle', sql.NVarChar, metaTitle || null)
      .input('metaDescription', sql.NVarChar, metaDescription || null)
      .input('sections', sql.NVarChar, sections ? JSON.stringify(sections) : null)
      .query(`
        MERGE PageContent AS target
        USING (SELECT @pageId AS pageId) AS source
        ON target.pageId = source.pageId
        WHEN MATCHED THEN 
          UPDATE SET title = @title, content = @content, metaTitle = @metaTitle, 
                     metaDescription = @metaDescription, sections = @sections, updatedAt = GETDATE()
        WHEN NOT MATCHED THEN 
          INSERT (pageId, title, content, metaTitle, metaDescription, sections, createdAt) 
          VALUES (@pageId, @title, @content, @metaTitle, @metaDescription, @sections, GETDATE());
      `);

    // Fetch the updated/inserted record
    const fetchResult = await pool.request()
      .input('pageId', sql.NVarChar, pageId)
      .query('SELECT * FROM PageContent WHERE pageId = @pageId');

    res.json(fetchResult.recordset[0]);
  } catch (error) {
    console.error('Update page content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllPageContent = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT pageId, title, metaTitle, metaDescription, updatedAt FROM PageContent ORDER BY pageId');

    res.json(result.recordset);
  } catch (error) {
    console.error('Get all page content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
