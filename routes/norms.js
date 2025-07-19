const express = require('express');
const router = express.Router();
const { Norms } = require('../database/database');

// GET current sensor limits/norms
router.get('/', async (req, res) => {
  try {
    const norms = await Norms.findByPk(1);
    
    if (!norms) {
      return res.status(404).json({ error: 'Norms not found. Please initialize the database first.' });
    }
    
    res.json(norms);
  } catch (error) {
    console.error('Error fetching norms:', error);
    res.status(500).json({ error: 'Failed to fetch norms' });
  }
});

// PUT update sensor limits/norms
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    
    // Validate that at least one field is provided
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }
    
    // List of allowed fields that can be updated
    const allowedFields = [
      'PhMax', 'PhMin', 'AmmoniaMax', 'AmmoniaMin', 'NitriteMax', 'NitriteMin',
      'NitrateMax', 'NitrateMin', 'DissolvedOxygenMax', 'DissolvedOxygenMin',
      'OrpMax', 'OrpMin', 'SalinityMax', 'SalinityMin', 'TemperatureMax', 'TemperatureMin',
      'TurbidityMax', 'TurbidityMin', 'WaterLevelMax', 'WaterLevelMin',
      'TocMax', 'TocMin', 'FishActivityMax', 'FishActivityMin',
      'FeedingResponseMax', 'FeedingResponseMin', 'BacteriaDensityMax', 'BacteriaDensityMin', 
      'WaterPurityMax', 'WaterPurityMin'
    ];
    
    // Filter out invalid fields
    const validUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // Validate that the value is a number
        if (typeof value === 'number' && !isNaN(value)) {
          validUpdates[key] = value;
        } else {
          return res.status(400).json({ error: `Invalid value for ${key}. Must be a number.` });
        }
      }
    }
    
    if (Object.keys(validUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }
    
    // Update the norms record
    const [updatedRowsCount] = await Norms.update(validUpdates, { where: { id: 1 } });
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Norms record not found' });
    }
    
    // Fetch and return the updated norms
    const updatedNorms = await Norms.findByPk(1);
    
    res.json({
      message: 'Norms updated successfully',
      updated_fields: Object.keys(validUpdates),
      norms: updatedNorms
    });
  } catch (error) {
    console.error('Error updating norms:', error);
    res.status(500).json({ error: 'Failed to update norms' });
  }
});

// POST initialize norms (if not exists)
router.post('/initialize', async (req, res) => {
  try {
    // Check if norms already exist
    const existingNorms = await Norms.findByPk(1);
    
    if (existingNorms) {
      return res.status(400).json({ error: 'Norms already initialized' });
    }
    
    // Create new norms record with default values
    const newNorms = await Norms.create({
      id: 1,
      // Default values are already set in the model definition
    });
    
    res.status(201).json({
      message: 'Norms initialized successfully',
      norms: newNorms
    });
  } catch (error) {
    console.error('Error initializing norms:', error);
    res.status(500).json({ error: 'Failed to initialize norms' });
  }
});

// GET current sensor limits in a user-friendly format
router.get('/sensor-limits', async (req, res) => {
  try {
    const norms = await Norms.findByPk(1);
    
    if (!norms) {
      return res.status(404).json({ error: 'Norms not found. Please initialize the database first.' });
    }
    
    // Convert database format to user-friendly format
    const sensorLimits = {
      ph: {
        min: norms.PhMin,
        max: norms.PhMax,
        unit: '',
        name: 'pH Level'
      },
      ammonia: {
        min: norms.AmmoniaMin,
        max: norms.AmmoniaMax,
        unit: 'ppm',
        name: 'Ammonia'
      },
      nitrite: {
        min: norms.NitriteMin,
        max: norms.NitriteMax,
        unit: 'ppm',
        name: 'Nitrite'
      },
      nitrate: {
        min: norms.NitrateMin,
        max: norms.NitrateMax,
        unit: 'ppm',
        name: 'Nitrate'
      },
      dissolved_oxygen: {
        min: norms.DissolvedOxygenMin,
        max: norms.DissolvedOxygenMax,
        unit: 'ppm',
        name: 'Dissolved Oxygen'
      },
      orp: {
        min: norms.OrpMin,
        max: norms.OrpMax,
        unit: 'mV',
        name: 'ORP (Oxidation-Reduction Potential)'
      },
      salinity: {
        min: norms.SalinityMin,
        max: norms.SalinityMax,
        unit: 'ppt',
        name: 'Salinity'
      },
      temperature: {
        min: norms.TemperatureMin,
        max: norms.TemperatureMax,
        unit: '°C',
        name: 'Temperature'
      },
      turbidity: {
        min: norms.TurbidityMin,
        max: norms.TurbidityMax,
        unit: 'NTU',
        name: 'Turbidity'
      },
      water_level: {
        min: norms.WaterLevelMin,
        max: norms.WaterLevelMax,
        unit: 'cm',
        name: 'Water Level'
      },
      toc: {
        min: norms.TocMin,
        max: norms.TocMax,
        unit: 'ppm',
        name: 'Total Organic Carbon'
      },
      fish_activity: {
        min: norms.FishActivityMin,
        max: norms.FishActivityMax,
        unit: '%',
        name: 'Fish Activity Level'
      },
      feeding_response: {
        min: norms.FeedingResponseMin,
        max: norms.FeedingResponseMax,
        unit: '%',
        name: 'Feeding Response Strike Rate'
      }
    };
    
    res.json(sensorLimits);
  } catch (error) {
    console.error('Error fetching sensor limits:', error);
    res.status(500).json({ error: 'Failed to fetch sensor limits' });
  }
});

module.exports = router;
