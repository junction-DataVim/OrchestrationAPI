const express = require('express');
const router = express.Router();
const { TocReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all TOC readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id: parseInt(pool_id) } : {};
    
    const readings = await TocReading.findAll({
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
    console.error('Error fetching TOC readings:', error);
    res.status(500).json({ error: 'Failed to fetch TOC readings' });
  }
});

// GET TOC readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await TocReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No TOC readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching TOC readings:', error);
    res.status(500).json({ error: 'Failed to fetch TOC readings' });
  }
});

// POST new TOC reading
router.post('/', async (req, res) => {
  try {
    const { pool_id, toc_ppm, bod_ppm, notes } = req.body;
    
    // Validate required fields
    if (!pool_id) {
      return res.status(400).json({ error: 'pool_id is required' });
    }

    // At least one measurement should be provided
    if (toc_ppm === undefined && bod_ppm === undefined) {
      return res.status(400).json({ error: 'At least one of toc_ppm or bod_ppm must be provided' });
    }

    // Validate values (should be non-negative if provided)
    if (toc_ppm !== undefined && toc_ppm < 0) {
      return res.status(400).json({ error: 'TOC PPM must be non-negative' });
    }
    if (bod_ppm !== undefined && bod_ppm < 0) {
      return res.status(400).json({ error: 'BOD PPM must be non-negative' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await TocReading.create({
      pool_id,
      toc_ppm: toc_ppm || null,
      bod_ppm: bod_ppm || null,
      notes: notes || null
    });

    // Fetch the created reading with pool info
    const reading = await TocReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    // Check for alerts after successful creation
    await checkAndSendAlert('toc', toc_ppm, pool_id);
    
    res.status(201).json(reading);
  } catch (error) {
    console.error('Error creating TOC reading:', error);
    res.status(500).json({ error: 'Failed to create TOC reading' });
  }
});

module.exports = router;
