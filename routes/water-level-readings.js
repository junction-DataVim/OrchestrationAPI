const express = require('express');
const router = express.Router();
const { WaterLevelReading, Pool } = require('../database/database');

// GET all water level readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id: parseInt(pool_id) } : {};
    
    const readings = await WaterLevelReading.findAll({
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
    console.error('Error fetching water level readings:', error);
    res.status(500).json({ error: 'Failed to fetch water level readings' });
  }
});

// GET water level readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await WaterLevelReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No water level readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching water level readings:', error);
    res.status(500).json({ error: 'Failed to fetch water level readings' });
  }
});

// POST new water level reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, water_level_cm, flow_rate_lpm, notes } = req.body;
    
    // Validate required fields
    if (!pool_id) {
      return res.status(400).json({ error: 'pool_id is required' });
    }

    // At least one measurement should be provided
    if (water_level_cm === undefined && flow_rate_lpm === undefined) {
      return res.status(400).json({ error: 'At least one of water_level_cm or flow_rate_lpm must be provided' });
    }

    // Validate values (should be non-negative if provided)
    if (water_level_cm !== undefined && water_level_cm < 0) {
      return res.status(400).json({ error: 'Water level must be non-negative' });
    }
    if (flow_rate_lpm !== undefined && flow_rate_lpm < 0) {
      return res.status(400).json({ error: 'Flow rate must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await WaterLevelReading.create({
      pool_id,
      water_level_cm: water_level_cm || null,
      flow_rate_lpm: flow_rate_lpm || null,
      notes: notes || null
    });

    // Fetch the created reading with pool info
    const reading = await WaterLevelReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    res.status(201).json(reading);
  } catch (error) {
    console.error('Error creating water level reading:', error);
    res.status(500).json({ error: 'Failed to create water level reading' });
  }
});

module.exports = router;
