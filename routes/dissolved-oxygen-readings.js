const express = require('express');
const router = express.Router();
const { DissolvedOxygenReading, Pool } = require('../database/database');

// GET all dissolved oxygen readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await DissolvedOxygenReading.findAll({
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
    console.error('Error fetching dissolved oxygen readings:', error);
    res.status(500).json({ error: 'Failed to fetch dissolved oxygen readings' });
  }
});

// GET dissolved oxygen readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await DissolvedOxygenReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No dissolved oxygen readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching dissolved oxygen readings:', error);
    res.status(500).json({ error: 'Failed to fetch dissolved oxygen readings' });
  }
});

// POST new dissolved oxygen reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, do_ppm, do_percent_saturation, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || do_ppm === undefined) {
      return res.status(400).json({ error: 'pool_id and do_ppm are required' });
    }

    // Validate dissolved oxygen value (should be non-negative)
    if (do_ppm < 0) {
      return res.status(400).json({ error: 'Dissolved oxygen PPM must be non-negative' });
    }

    // Validate saturation percentage if provided
    if (do_percent_saturation !== undefined && (do_percent_saturation < 0 || do_percent_saturation > 100)) {
      return res.status(400).json({ error: 'Saturation percentage must be between 0 and 100' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await DissolvedOxygenReading.create({
      pool_id,
      do_ppm,
      do_percent_saturation,
      notes
    });

    // Include pool information in response
    const readingWithPool = await DissolvedOxygenReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating dissolved oxygen reading:', error);
    res.status(500).json({ error: 'Failed to create dissolved oxygen reading' });
  }
});

module.exports = router;
