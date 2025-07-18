const express = require('express');
const router = express.Router();
const { TurbidityReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all turbidity readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id: parseInt(pool_id) } : {};
    
    const readings = await TurbidityReading.findAll({
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
    console.error('Error fetching turbidity readings:', error);
    res.status(500).json({ error: 'Failed to fetch turbidity readings' });
  }
});

// GET turbidity readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await TurbidityReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'name', 'location']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No turbidity readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching turbidity readings:', error);
    res.status(500).json({ error: 'Failed to fetch turbidity readings' });
  }
});

// POST new turbidity reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, turbidity_ntu, notes } = req.body;
    
    // Validate required fields
    if (!pool_id || turbidity_ntu === undefined) {
      return res.status(400).json({ error: 'pool_id and turbidity_ntu are required' });
    }

    // Validate turbidity value (should be non-negative)
    if (turbidity_ntu < 0) {
      return res.status(400).json({ error: 'Turbidity NTU must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await TurbidityReading.create({
      pool_id,
      turbidity_ntu,
      notes
    });

    // Include pool information in response
    const readingWithPool = await TurbidityReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('turbidity', turbidity_ntu, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating turbidity reading:', error);
    res.status(500).json({ error: 'Failed to create turbidity reading' });
  }
});

module.exports = router;
