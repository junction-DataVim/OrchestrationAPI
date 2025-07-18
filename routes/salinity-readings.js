const express = require('express');
const router = express.Router();
const { SalinityReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all salinity readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id: parseInt(pool_id) } : {};
    
    const readings = await SalinityReading.findAll({
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
    console.error('Error fetching salinity readings:', error);
    res.status(500).json({ error: 'Failed to fetch salinity readings' });
  }
});

// GET salinity readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await SalinityReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'name', 'location']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No salinity readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching salinity readings:', error);
    res.status(500).json({ error: 'Failed to fetch salinity readings' });
  }
});

// POST new salinity reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, salinity_ppt, conductivity_us_cm, tds_ppm, notes } = req.body;
    
    // Validate required fields
    if (!pool_id) {
      return res.status(400).json({ error: 'pool_id is required' });
    }

    // At least one measurement should be provided
    if (salinity_ppt === undefined && conductivity_us_cm === undefined && tds_ppm === undefined) {
      return res.status(400).json({ error: 'At least one of salinity_ppt, conductivity_us_cm, or tds_ppm must be provided' });
    }

    // Validate values (should be non-negative if provided)
    if (salinity_ppt !== undefined && salinity_ppt < 0) {
      return res.status(400).json({ error: 'Salinity PPT must be non-negative' });
    }
    if (conductivity_us_cm !== undefined && conductivity_us_cm < 0) {
      return res.status(400).json({ error: 'Conductivity must be non-negative' });
    }
    if (tds_ppm !== undefined && tds_ppm < 0) {
      return res.status(400).json({ error: 'TDS PPM must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await SalinityReading.create({
      pool_id,
      salinity_ppt,
      conductivity_us_cm,
      tds_ppm,
      notes
    });

    // Include pool information in response
    const readingWithPool = await SalinityReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('salinity', salinity_ppt, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating salinity reading:', error);
    res.status(500).json({ error: 'Failed to create salinity reading' });
  }
});

module.exports = router;
