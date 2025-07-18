const express = require('express');
const router = express.Router();
const { AmmoniaReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');
const { where } = require('sequelize');

// GET all ammonia readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await AmmoniaReading.findAll({
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
    console.error('Error fetching ammonia readings:', error);
    res.status(500).json({ error: 'Failed to fetch ammonia readings' });
  }
});

// GET ammonia readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await AmmoniaReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No ammonia readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching ammonia readings:', error);
    res.status(500).json({ error: 'Failed to fetch ammonia readings' });
  }
});

// POST new ammonia reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, ammonia_ppm, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || ammonia_ppm === undefined) {
      return res.status(400).json({ error: 'pool_id and ammonia_ppm are required' });
    }

    // Validate ammonia value (should be non-negative)
    if (ammonia_ppm < 0) {
      return res.status(400).json({ error: 'Ammonia PPM must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findOne({ 
      where: { pool_id } 
    });
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await AmmoniaReading.create({
      pool_id,
      ammonia_ppm,
      notes
    });

    // Include pool information in response
    const readingWithPool = await AmmoniaReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('ammonia', ammonia_ppm, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating ammonia reading:', error);
    res.status(500).json({ error: 'Failed to create ammonia reading' });
  }
});

module.exports = router;
