const express = require('express');
const router = express.Router();
const { FishActivityReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all fish activity readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id: parseInt(pool_id) } : {};
    
    const readings = await FishActivityReading.findAll({
      where: whereClause,
      order: [['reading_timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Pool,
        attributes: ['pool_id', 'name', 'location']
      }]
    });
    
    res.json(readings);
  } catch (error) {
    console.error('Error fetching fish activity readings:', error);
    res.status(500).json({ error: 'Failed to fetch fish activity readings' });
  }
});

// GET fish activity readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await FishActivityReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'name', 'location']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No fish activity readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching fish activity readings:', error);
    res.status(500).json({ error: 'Failed to fetch fish activity readings' });
  }
});

// POST new fish activity reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, activity_level, movement_count, average_speed, notes } = req.body;
    
    // Validate required fields
    if (!pool_id) {
      return res.status(400).json({ error: 'pool_id is required' });
    }

    // At least one measurement should be provided
    if (activity_level === undefined && movement_count === undefined && average_speed === undefined) {
      return res.status(400).json({ error: 'At least one of activity_level, movement_count, or average_speed must be provided' });
    }

    // Validate values
    if (activity_level !== undefined && (activity_level < 0 || activity_level > 100)) {
      return res.status(400).json({ error: 'Activity level must be between 0 and 100' });
    }
    if (movement_count !== undefined && movement_count < 0) {
      return res.status(400).json({ error: 'Movement count must be non-negative' });
    }
    if (average_speed !== undefined && average_speed < 0) {
      return res.status(400).json({ error: 'Average speed must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await FishActivityReading.create({
      pool_id,
      activity_level,
      movement_count,
      average_speed,
      notes
    });

    // Include pool information in response
    const readingWithPool = await FishActivityReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('fish_activity', activity_level, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating fish activity reading:', error);
    res.status(500).json({ error: 'Failed to create fish activity reading' });
  }
});

module.exports = router;
