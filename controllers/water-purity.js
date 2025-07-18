const { PhReading, AmmoniaReading, NitriteReading, DissolvedOxygenReading, OrpReading, 
    TemperatureReading, TurbidityReading, WaterPurityReading } = require('../database/database');

const API_URL = process.env.WATER_PURITY_URL || 'http://localhost:8000/predict';

const water_purity = async (pool_id) => {
    const [latestPh, latestAmmonia, latestNitrite, latestDo, latestOrp, 
    latestTemperature, latestTurbidity] = await Promise.all([
    PhReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
    AmmoniaReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
    NitriteReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
    DissolvedOxygenReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
    OrpReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
    TemperatureReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] }),
    TurbidityReading.findOne({ where: { pool_id }, order: [['reading_timestamp', 'DESC']] })
    ]);

    const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        temp: latestTemperature ? latestTemperature.temperature_celsius : null,
        turbidity: latestTurbidity ? latestTurbidity.turbidity_ntu : null,
        do: latestDo ? latestDo.do_ppm : null,
        bod: latestOrp ? latestOrp.orp_mv : null,
        ph: latestPh ? latestPh.ph_value : null,
        ammonia: latestAmmonia ? latestAmmonia.ammonia_ppm : null,
        nitrite: latestNitrite ? latestNitrite.nitrite_ppm : null
    })
    });
    if (!response.ok) {
    throw new Error('Failed to fetch water purity prediction');
    }
    const data = await response.json();
    await WaterPurityReading.create({
    pool_id: pool_id,
    quality: data.quality,
    excellent: data.probabilities.Excellent,
    good: data.probabilities.Good,
    poor: data.probabilities.Poor,
    });
}

exports.water_purity = water_purity;    