const express = require('express');
const router = express.Router();
const { Pool } = require('../database/database');

// GET all pools
router.get('/', async (req, res) => {
  try {
    const pools = await Pool.findAll({
      order: [['pool_id', 'ASC']]
    });
    res.json(pools);
  } catch (error) {
    console.error('Error fetching pools:', error);
    res.status(500).json({ error: 'Failed to fetch pools' });
  }
});

// GET pool by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await Pool.findOne({
      where: { 
        pool_id: req.params.id,
      }
    });
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    res.json(pool);
  } catch (error) {
    console.error('Error fetching pool:', error);
    res.status(500).json({ error: 'Failed to fetch pool' });
  }
});

// POST new pool
router.post('/', async (req, res) => {
  try {
    const { number_of_fish, age_of_fish, capacity_liters } = req.body;

    const newPool = await Pool.create({
      number_of_fish: number_of_fish || 0,
      age_of_fish: age_of_fish || 0,
      capacity_liters
    });

    res.status(201).json(newPool);
  } catch (error) {
    console.error('Error creating pool:', error);
    res.status(500).json({ error: 'Failed to create pool' });
  }
});

// PUT update pool
router.put('/:id', async (req, res) => {
  try {
    const { number_of_fish, age_of_fish, capacity_liters } = req.body;
    
    const pool = await Pool.findByPk(req.params.id);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    const updatedPool = await pool.update({
      number_of_fish: number_of_fish !== undefined ? number_of_fish : pool.number_of_fish,
      age_of_fish: age_of_fish !== undefined ? age_of_fish : pool.age_of_fish,
      capacity_liters: capacity_liters !== undefined ? capacity_liters : pool.capacity_liters
    });

    res.json(updatedPool);
  } catch (error) {
    console.error('Error updating pool:', error);
    res.status(500).json({ error: 'Failed to update pool' });
  }
});

module.exports = router;
