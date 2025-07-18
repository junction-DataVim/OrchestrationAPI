const express = require('express');
const router = express.Router();
const { TemperatureReading, Pool } = require('../database/database');

// GET all temperature readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await TemperatureReading.findAll({
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
    console.error('Error fetching temperature readings:', error);
    res.status(500).json({ error: 'Failed to fetch temperature readings' });
  }
});

// GET temperature readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await TemperatureReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No temperature readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching temperature readings:', error);
    res.status(500).json({ error: 'Failed to fetch temperature readings' });
  }
});

// POST new temperature reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, temperature_celsius, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || temperature_celsius === undefined) {
      return res.status(400).json({ error: 'pool_id and temperature_celsius are required' });
    }

    // Validate temperature range (reasonable range for aquaculture)
    if (temperature_celsius < -5 || temperature_celsius > 50) {
      return res.status(400).json({ error: 'Temperature must be between -5°C and 50°C' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await TemperatureReading.create({
      pool_id,
      temperature_celsius,
      notes
    });

    // Include pool information in response
    const readingWithPool = await TemperatureReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating temperature reading:', error);
    res.status(500).json({ error: 'Failed to create temperature reading' });
  }
});

module.exports = router;
