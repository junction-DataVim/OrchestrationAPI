const express = require('express');
const router = express.Router();
const { PhReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all pH readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await PhReading.findAll({
      where: whereClause,
      order: [['reading_timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    res.json(readings);
  } catch (error) {
    console.error('Error fetching pH readings:', error);
    res.status(500).json({ error: 'Failed to fetch pH readings' });
  }
});

// GET pH readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await PhReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No pH readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching pH readings:', error);
    res.status(500).json({ error: 'Failed to fetch pH readings' });
  }
});

// POST new pH reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, ph_value, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || ph_value === undefined) {
      return res.status(400).json({ error: 'pool_id and ph_value are required' });
    }

    // Validate pH value range
    if (ph_value < 0 || ph_value > 14) {
      return res.status(400).json({ error: 'pH value must be between 0 and 14' });
    }

    // Check if pool exists
    const pool = await Pool.findOne({ 
      where: { 
        pool_id
      } 
    });
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await PhReading.create({
      pool_id,
      ph_value,
      notes
    });

    // Include pool information in response
    const readingWithPool = await PhReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('ph', ph_value, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating pH reading:', error);
    res.status(500).json({ error: 'Failed to create pH reading' });
  }
});

module.exports = router;
