const express = require('express');
const router = express.Router();
const { OrpReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all ORP readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await OrpReading.findAll({
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
    console.error('Error fetching ORP readings:', error);
    res.status(500).json({ error: 'Failed to fetch ORP readings' });
  }
});

// GET ORP readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await OrpReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No ORP readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching ORP readings:', error);
    res.status(500).json({ error: 'Failed to fetch ORP readings' });
  }
});

// POST new ORP reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, orp_mv, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || orp_mv === undefined) {
      return res.status(400).json({ error: 'pool_id and orp_mv are required' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await OrpReading.create({
      pool_id,
      orp_mv,
      notes
    });

    // Include pool information in response
    const readingWithPool = await OrpReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('orp', orp_mv, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating ORP reading:', error);
    res.status(500).json({ error: 'Failed to create ORP reading' });
  }
});

module.exports = router;
