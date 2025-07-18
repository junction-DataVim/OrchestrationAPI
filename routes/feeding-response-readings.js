const express = require('express');
const router = express.Router();
const { FeedingResponseReading, Pool } = require('../database/database');

// GET all feeding response readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id: parseInt(pool_id) } : {};
    
    const readings = await FeedingResponseReading.findAll({
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
    console.error('Error fetching feeding response readings:', error);
    res.status(500).json({ error: 'Failed to fetch feeding response readings' });
  }
});

// GET feeding response readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await FeedingResponseReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'name', 'location']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No feeding response readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching feeding response readings:', error);
    res.status(500).json({ error: 'Failed to fetch feeding response readings' });
  }
});

// POST new feeding response reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, strike_rate_percent, feeding_attempts, successful_strikes, response_time_seconds, notes } = req.body;
    
    // Validate required fields
    if (!pool_id) {
      return res.status(400).json({ error: 'pool_id is required' });
    }

    // At least one measurement should be provided
    if (strike_rate_percent === undefined && feeding_attempts === undefined && successful_strikes === undefined && response_time_seconds === undefined) {
      return res.status(400).json({ error: 'At least one measurement must be provided' });
    }

    // Validate values
    if (strike_rate_percent !== undefined && (strike_rate_percent < 0 || strike_rate_percent > 100)) {
      return res.status(400).json({ error: 'Strike rate percent must be between 0 and 100' });
    }
    if (feeding_attempts !== undefined && feeding_attempts < 0) {
      return res.status(400).json({ error: 'Feeding attempts must be non-negative' });
    }
    if (successful_strikes !== undefined && successful_strikes < 0) {
      return res.status(400).json({ error: 'Successful strikes must be non-negative' });
    }
    if (response_time_seconds !== undefined && response_time_seconds < 0) {
      return res.status(400).json({ error: 'Response time must be non-negative' });
    }

    // Validate that successful strikes <= feeding attempts if both are provided
    if (feeding_attempts !== undefined && successful_strikes !== undefined && successful_strikes > feeding_attempts) {
      return res.status(400).json({ error: 'Successful strikes cannot exceed feeding attempts' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await FeedingResponseReading.create({
      pool_id,
      strike_rate_percent,
      feeding_attempts,
      successful_strikes,
      response_time_seconds,
      notes
    });

    // Include pool information in response
    const readingWithPool = await FeedingResponseReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating feeding response reading:', error);
    res.status(500).json({ error: 'Failed to create feeding response reading' });
  }
});

module.exports = router;
