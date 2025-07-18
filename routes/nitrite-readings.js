const express = require('express');
const router = express.Router();
const { NitriteReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all nitrite readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await NitriteReading.findAll({
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
    console.error('Error fetching nitrite readings:', error);
    res.status(500).json({ error: 'Failed to fetch nitrite readings' });
  }
});

// GET nitrite readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await NitriteReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No nitrite readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching nitrite readings:', error);
    res.status(500).json({ error: 'Failed to fetch nitrite readings' });
  }
});

// POST new nitrite reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, nitrite_ppm, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || nitrite_ppm === undefined) {
      return res.status(400).json({ error: 'pool_id and nitrite_ppm are required' });
    }

    // Validate nitrite value (should be non-negative)
    if (nitrite_ppm < 0) {
      return res.status(400).json({ error: 'Nitrite PPM must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await NitriteReading.create({
      pool_id,
      nitrite_ppm,
      notes
    });

    // Include pool information in response
    const readingWithPool = await NitriteReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('nitrite', nitrite_ppm, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating nitrite reading:', error);
    res.status(500).json({ error: 'Failed to create nitrite reading' });
  }
});

module.exports = router;
