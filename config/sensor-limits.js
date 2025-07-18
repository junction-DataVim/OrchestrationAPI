const {Norms} = require('../database/database'); // Import the Norms model


async function getSensorLimits() {
    await require('../database/database').sequelize.sync(); // Ensure DB is initialized
    const normality = await Norms.findByPk(1);
    if (!normality) {
        throw new Error('Norms data not found in database. Please ensure the Norms table is populated.');
    }
    return {
        ph: {
            min: normality['PhMin'],
            max: normality['PhMax'],
            unit: '',
            name: 'pH Level',
            field: 'ph_value'
        },
        ammonia: {
            min: normality['AmmoniaMin'],
            max: normality['AmmoniaMax'],
            unit: 'ppm',
            name: 'Ammonia',
            field: 'ammonia_ppm'
        },
        nitrite: {
            min: normality['NitriteMin'],
            max: normality['NitriteMax'],
            unit: 'ppm',
            name: 'Nitrite',
            field: 'nitrite_ppm'
        },
        nitrate: {
            min: normality['NitrateMin'],
            max: normality['NitrateMax'],
            unit: 'ppm',
            name: 'Nitrate',
            field: 'nitrate_ppm'
        },
        dissolved_oxygen: {
            min: normality['DissolvedOxygenMin'],
            max: normality['DissolvedOxygenMax'],
            unit: 'ppm',
            name: 'Dissolved Oxygen',
            field: 'do_ppm'
        },
        orp: {
            min: normality['OrpMin'],
            max: normality['OrpMax'],
            unit: 'mV',
            name: 'ORP (Oxidation-Reduction Potential)',
            field: 'orp_mv'
        },
        salinity: {
            min: normality['SalinityMin'],
            max: normality['SalinityMax'],
            unit: 'ppt',
            name: 'Salinity',
            field: 'salinity_ppt'
        },
        temperature: {
            min: normality['TemperatureMin'],
            max: normality['TemperatureMax'],
            unit: '°C',
            name: 'Temperature',
            field: 'temperature_celsius'
        },
        turbidity: {
            min: normality['TurbidityMin'],
            max: normality['TurbidityMax'],
            unit: 'NTU',
            name: 'Turbidity',
            field: 'turbidity_ntu'
        },
        water_level: {
            min: normality['WaterLevelMin'],
            max: normality['WaterLevelMax'],
            unit: 'cm',
            name: 'Water Level',
            field: 'water_level_cm'
        },
        toc: {
            min: normality['TocMin'],
            max: normality['TocMax'],
            unit: 'ppm',
            name: 'Total Organic Carbon',
            field: 'toc_ppm'
        },
        fish_activity: {
            min: normality['FishActivityMin'],
            max: normality['FishActivityMax'],
            unit: '%',
            name: 'Fish Activity Level',
            field: 'activity_level'
        },
        feeding_response: {
            min: normality['FeedingResponseMin'],
            max: normality['FeedingResponseMax'],
            unit: '%',
            name: 'Feeding Response Strike Rate',
            field: 'strike_rate_percent'
        }
    };
}

module.exports = {
    getSensorLimits,
    ALERT_CONTACTS: [
        "213540392348",
    ],
    ALERT_COOLDOWN: 30
};
