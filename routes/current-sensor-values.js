const express = require('express');
const router = express.Router();
const { getDatabase, PhReading, AmmoniaReading, NitriteReading, NitrateReading, 
        DissolvedOxygenReading, OrpReading, SalinityReading, TemperatureReading, 
        TurbidityReading, WaterLevelReading, TocReading, FishActivityReading, 
        FeedingResponseReading, BacteriaDensityReading, Pool,WaterPurityReading } = require('../database/database');


// GET latest sensor readings from all tables for a specific pool
router.get('/latest/:pool_id', async (req, res) => {
  try {
    const { pool_id } = req.params;
    
    // Check if pool exists
    const pool = await Pool.findByPk(pool_id);
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    // Fetch latest reading from each sensor type
    const [latestPh, latestAmmonia, latestNitrite, latestNitrate, latestDo, 
           latestOrp, latestSalinity, latestTemperature, latestTurbidity, 
           latestWaterLevel, latestToc, latestFishActivity, latestFeedingResponse, 
           latestBacteriaDensity, lastestWaterPurity] = await Promise.all([
      PhReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      AmmoniaReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      NitriteReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      NitrateReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      DissolvedOxygenReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      OrpReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      SalinityReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      TemperatureReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      TurbidityReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      WaterLevelReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      TocReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      FishActivityReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      FeedingResponseReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      BacteriaDensityReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
      FeedingResponseReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
        WaterPurityReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] })
    ]);


    const latestReadings = {
      pool: {
        pool_id: pool.pool_id,
        name: pool.name,
        location: pool.location
      },
      sensors: {
        ph: latestPh ? {
          value: latestPh.ph_value,
          timestamp: latestPh.reading_timestamp,
          reading_id: latestPh.reading_id
        } : null,
        ammonia: latestAmmonia ? {
          value: latestAmmonia.ammonia_ppm,
          timestamp: latestAmmonia.reading_timestamp,
          reading_id: latestAmmonia.reading_id
        } : null,
        nitrite: latestNitrite ? {
          value: latestNitrite.nitrite_ppm,
          timestamp: latestNitrite.reading_timestamp,
          reading_id: latestNitrite.reading_id
        } : null,
        nitrate: latestNitrate ? {
          value: latestNitrate.nitrate_ppm,
          timestamp: latestNitrate.reading_timestamp,
          reading_id: latestNitrate.reading_id
        } : null,
        dissolved_oxygen: latestDo ? {
          value: latestDo.do_ppm,
          saturation_percent: latestDo.do_percent_saturation,
          timestamp: latestDo.reading_timestamp,
          reading_id: latestDo.reading_id
        } : null,
        orp: latestOrp ? {
          value: latestOrp.orp_mv,
          timestamp: latestOrp.reading_timestamp,
          reading_id: latestOrp.reading_id
        } : null,
        salinity: latestSalinity ? {
          value: latestSalinity.salinity_ppt,
          timestamp: latestSalinity.reading_timestamp,
          reading_id: latestSalinity.reading_id
        } : null,
        temperature: latestTemperature ? {
          value: latestTemperature.temperature_celsius,
          timestamp: latestTemperature.reading_timestamp,
          reading_id: latestTemperature.reading_id
        } : null,
        turbidity: latestTurbidity ? {
          value: latestTurbidity.turbidity_ntu,
          timestamp: latestTurbidity.reading_timestamp,
          reading_id: latestTurbidity.reading_id
        } : null,
        water_level: latestWaterLevel ? {
          level_cm: latestWaterLevel.water_level_cm,
          flow_rate_lpm: latestWaterLevel.flow_rate_lpm,
          timestamp: latestWaterLevel.reading_timestamp,
          reading_id: latestWaterLevel.reading_id
        } : null,
        toc: latestToc ? {
          toc_ppm: latestToc.toc_ppm,
          bod_ppm: latestToc.bod_ppm,
          timestamp: latestToc.reading_timestamp,
          reading_id: latestToc.reading_id
        } : null,
        fish_activity: latestFishActivity ? {
          activity_level: latestFishActivity.activity_level,
          movement_count: latestFishActivity.movement_count,
          average_speed: latestFishActivity.average_speed,
          timestamp: latestFishActivity.reading_timestamp,
          reading_id: latestFishActivity.reading_id
        } : null,
        feeding_response: latestFeedingResponse ? {
          strike_rate_percent: latestFeedingResponse.strike_rate_percent,
          response_time_seconds: latestFeedingResponse.response_time_seconds,
          timestamp: latestFeedingResponse.reading_timestamp,
          reading_id: latestFeedingResponse.reading_id
        } : null,
        bacteria_density: latestBacteriaDensity ? {
          bacteria_density_cfu_ml: latestBacteriaDensity.bacteria_density_cfu_ml,
          total_bacteria_count: latestBacteriaDensity.total_bacteria_count,
          pathogenic_bacteria: latestBacteriaDensity.pathogenic_bacteria,
          beneficial_bacteria: latestBacteriaDensity.beneficial_bacteria,
          bacteria_type: latestBacteriaDensity.bacteria_type,
          timestamp: latestBacteriaDensity.reading_timestamp,
          reading_id: latestBacteriaDensity.reading_id
        } : null,
        water_purity: lastestWaterPurity ? {
          quality: lastestWaterPurity.quality,
          excellent: lastestWaterPurity.excellent,
          good: lastestWaterPurity.good,
          poor: lastestWaterPurity.poor,
          timestamp: lastestWaterPurity.reading_timestamp,
          reading_id: lastestWaterPurity.reading_id
        } : null
      }
    };

    res.json(latestReadings);
  } catch (error) {
    console.error('Error fetching latest sensor readings:', error);
    res.status(500).json({ error: 'Failed to fetch latest sensor readings' });
  }
});

module.exports = router;
