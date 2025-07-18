const express = require('express');
const router = express.Router();
const { NitrateReading, Pool } = require('../database/database');

// GET all nitrate readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await NitrateReading.findAll({
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
    console.error('Error fetching nitrate readings:', error);
    res.status(500).json({ error: 'Failed to fetch nitrate readings' });
  }
});

// GET nitrate readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await NitrateReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No nitrate readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching nitrate readings:', error);
    res.status(500).json({ error: 'Failed to fetch nitrate readings' });
  }
});

// POST new nitrate reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, nitrate_ppm, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || nitrate_ppm === undefined) {
      return res.status(400).json({ error: 'pool_id and nitrate_ppm are required' });
    }

    // Validate nitrate value (should be non-negative)
    if (nitrate_ppm < 0) {
      return res.status(400).json({ error: 'Nitrate PPM must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await NitrateReading.create({
      pool_id,
      nitrate_ppm,
      notes
    });

    // Include pool information in response
    const readingWithPool = await NitrateReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating nitrate reading:', error);
    res.status(500).json({ error: 'Failed to create nitrate reading' });
  }
});

module.exports = router;
