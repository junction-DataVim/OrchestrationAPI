const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/database');

// GET all daily sensor summaries
router.get('/', async (req, res) => {
  try {
    const { pool_id, sensor_type, start_date, end_date, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM daily_sensor_summary';
    let params = [];
    let conditions = [];
    
    if (pool_id) {
      conditions.push('pool_id = ?');
      params.push(pool_id);
    }
    
    if (sensor_type) {
      conditions.push('sensor_type = ?');
      params.push(sensor_type);
    }
    
    if (start_date) {
      conditions.push('summary_date >= ?');
      params.push(start_date);
    }
    
    if (end_date) {
      conditions.push('summary_date <= ?');
      params.push(end_date);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY summary_date DESC, pool_id, sensor_type LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const db = await getDatabase();
    const rows = await db.all(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching daily sensor summaries:', error);
    res.status(500).json({ error: 'Failed to fetch daily sensor summaries' });
  }
});

// GET daily sensor summary by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const row = await db.get('SELECT * FROM daily_sensor_summary WHERE summary_id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Daily sensor summary not found' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error fetching daily sensor summary:', error);
    res.status(500).json({ error: 'Failed to fetch daily sensor summary' });
  }
});

// POST new daily sensor summary
router.post('/', async (req, res) => {
  try {
    const { pool_id, sensor_type, summary_date, min_value, max_value, avg_value, reading_count } = req.body;
    
    // Validate required fields
    if (!pool_id || !sensor_type || !summary_date) {
      return res.status(400).json({ error: 'pool_id, sensor_type, and summary_date are required' });
    }

    // Validate sensor_type
    const validSensorTypes = ['ph', 'ammonia', 'nitrite', 'nitrate', 'dissolved_oxygen', 'orp', 'salinity', 'temperature', 'turbidity', 'water_level', 'toc', 'fish_activity', 'feeding_response'];
    if (!validSensorTypes.includes(sensor_type)) {
      return res.status(400).json({ error: 'Invalid sensor_type' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(summary_date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Validate values
    if (min_value !== undefined && max_value !== undefined && min_value > max_value) {
      return res.status(400).json({ error: 'min_value cannot be greater than max_value' });
    }

    if (reading_count !== undefined && reading_count < 0) {
      return res.status(400).json({ error: 'reading_count must be non-negative' });
    }

    // Check if pool exists
    const db = await getDatabase();
    const pool = await db.get('SELECT pool_id FROM pools WHERE pool_id = ?', [pool_id]);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    await db.run(
      'INSERT OR REPLACE INTO daily_sensor_summary (pool_id, sensor_type, summary_date, min_value, max_value, avg_value, reading_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [pool_id, sensor_type, summary_date, min_value || null, max_value || null, avg_value || null, reading_count || null]
    );

    // Fetch the created/updated summary
    const newSummary = await db.get(
      'SELECT * FROM daily_sensor_summary WHERE pool_id = ? AND sensor_type = ? AND summary_date = ?', 
      [pool_id, sensor_type, summary_date]
    );
    res.status(201).json(newSummary);
  } catch (error) {
    console.error('Error creating daily sensor summary:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Daily sensor summary already exists for this pool, sensor type, and date' });
    } else {
      res.status(500).json({ error: 'Failed to create daily sensor summary' });
    }
  }
});

module.exports = router;
