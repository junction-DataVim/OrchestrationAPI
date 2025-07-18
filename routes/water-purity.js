const express = require('express');
const { WaterPurityReading, Pool } = require('../database/database');
const router = express.Router();
const waterPurityController = require('../controllers/water-purity');

// GET all water purity readings
router.get('/', async (req, res) => {
  try {
    const readings = await WaterPurityReading.findAll({
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }],
      order: [['reading_timestamp', 'DESC']]
    });
    
    res.json(readings);
  } catch (error) {
    console.error('Error fetching water purity readings:', error);
    res.status(500).json({ error: 'Failed to fetch water purity readings' });
  }
});

// GET water purity readings by pool_id
router.get('/pool/:pool_id', async (req, res) => {
  try {
    const poolId = req.params.pool_id;
    
    const readings = await WaterPurityReading.findAll({
      where: { pool_id: poolId },
      include: [{
        model: Pool,
        aattributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }],
      order: [['reading_timestamp', 'DESC']]
    });
    
    if (readings.length === 0) {
      return res.status(404).json({ error: 'No water purity readings found for this pool' });
    }
    
    res.json(readings);
  } catch (error) {
    console.error('Error fetching water purity readings by pool:', error);
    res.status(500).json({ error: 'Failed to fetch water purity readings for pool' });
  }
});
router.get('/pool/:pool_id/latest', async (req, res) => {
    try {
    const poolId = req.params.pool_id;
    await waterPurityController.water_purity(poolId);
    const latestReading = await WaterPurityReading.findOne({
      where: { pool_id: poolId },
      order: [['reading_timestamp', 'DESC']],
      include: [{
        model: Pool,
        attributes: ['pool_id', 'number_of_fish', 'age_of_fish', 'capacity_liters']
      }]
    });
    if (!latestReading) {
      return res.status(404).json({ error: 'No water purity readings found for this pool' });
    }
    res.json(latestReading);
  } catch (error) {
    console.error('Error fetching latest water purity reading for pool:', error);
    res.status(500).json({ error: 'Failed to fetch latest water purity reading for pool' });
  }
});
module.exports = router;