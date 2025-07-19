const express = require('express');
const router = express.Router();
const { BacteriaDensityReading, Pool } = require('../database/database');
const { checkAndSendAlert } = require('../utils/alert-helper');

// GET all bacteria density readings
router.get('/', async (req, res) => {
  try {
    const { pool_id, limit = 100, offset = 0 } = req.query;
    
    const whereClause = pool_id ? { pool_id } : {};
    
    const readings = await BacteriaDensityReading.findAll({
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
    console.error('Error fetching bacteria density readings:', error);
    res.status(500).json({ error: 'Failed to fetch bacteria density readings' });
  }
});

// GET bacteria density readings by pool ID
router.get('/:id', async (req, res) => {
  try {
    const readings = await BacteriaDensityReading.findAll({
      where: { pool_id: req.params.id },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    
    if (!readings || readings.length === 0) {
      return res.status(404).json({ error: 'No bacteria density readings found for this pool' });
    }
    res.json(readings);
  } catch (error) {
    console.error('Error fetching bacteria density readings:', error);
    res.status(500).json({ error: 'Failed to fetch bacteria density readings' });
  }
});

// POST new bacteria density reading
router.post('/', async (req, res) => {
  try {
    const { 
      pool_id, 
      bacteria_density_cfu_ml, 
      total_bacteria_count,
      pathogenic_bacteria,
      beneficial_bacteria,
      bacteria_type,
      notes 
    } = req.body;
    
    // Validate required fields
    if (!pool_id || bacteria_density_cfu_ml === undefined) {
      return res.status(400).json({ error: 'pool_id and bacteria_density_cfu_ml are required' });
    }

    // Validate bacteria density range (reasonable range for aquaculture)
    if (bacteria_density_cfu_ml < 0 || bacteria_density_cfu_ml > 10000000) {
      return res.status(400).json({ error: 'Bacteria density must be between 0 and 10,000,000 CFU/ml' });
    }

    // Validate pathogenic and beneficial bacteria percentages if provided
    if (pathogenic_bacteria !== undefined && (pathogenic_bacteria < 0 || pathogenic_bacteria > 100)) {
      return res.status(400).json({ error: 'Pathogenic bacteria percentage must be between 0 and 100' });
    }

    if (beneficial_bacteria !== undefined && (beneficial_bacteria < 0 || beneficial_bacteria > 100)) {
      return res.status(400).json({ error: 'Beneficial bacteria percentage must be between 0 and 100' });
    }

    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(400).json({ error: 'Pool not found' });
    }

    const newReading = await BacteriaDensityReading.create({
      pool_id,
      bacteria_density_cfu_ml,
      total_bacteria_count,
      pathogenic_bacteria,
      beneficial_bacteria,
      bacteria_type,
      notes
    });

    // Include pool information in response
    const readingWithPool = await BacteriaDensityReading.findByPk(newReading.reading_id, {
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });

    // Check for alerts after successful creation
    await checkAndSendAlert('bacteria_density', bacteria_density_cfu_ml, pool_id);

    res.status(201).json(readingWithPool);
  } catch (error) {
    console.error('Error creating bacteria density reading:', error);
    res.status(500).json({ error: 'Failed to create bacteria density reading' });
  }
});

module.exports = router;
