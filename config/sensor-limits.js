// Sensor alert thresholds configuration
// Each sensor type has min/max acceptable values
// If readings fall outside these ranges, an SMS alert will be sent

const SENSOR_LIMITS = {
  ph: {
    min: 6.5,
    max: 8.5,
    unit: '',
    name: 'pH Level',
    field: 'ph_value'
  },
  ammonia: {
    min: 0,
    max: 0.25, // 0.25 ppm is typically the safe upper limit
    unit: 'ppm',
    name: 'Ammonia',
    field: 'ammonia_ppm'
  },
  nitrite: {
    min: 0,
    max: 0.5, // 0.5 ppm safe limit
    unit: 'ppm',
    name: 'Nitrite',
    field: 'nitrite_ppm'
  },
  nitrate: {
    min: 0,
    max: 40, // 40 ppm safe limit
    unit: 'ppm',
    name: 'Nitrate',
    field: 'nitrate_ppm'
  },
  dissolved_oxygen: {
    min: 5.0, // Minimum dissolved oxygen for fish health
    max: 15.0, // Maximum realistic level
    unit: 'ppm',
    name: 'Dissolved Oxygen',
    field: 'do_ppm'
  },
  orp: {
    min: 300, // Minimum ORP for good water quality
    max: 500, // Maximum safe ORP
    unit: 'mV',
    name: 'ORP (Oxidation-Reduction Potential)',
    field: 'orp_mv'
  },
  salinity: {
    min: 0,
    max: 35, // Depends on species, 35 ppt is typical seawater
    unit: 'ppt',
    name: 'Salinity',
    field: 'salinity_ppt'
  },
  temperature: {
    min: 15, // Minimum temperature for most fish
    max: 30, // Maximum safe temperature
    unit: '°C',
    name: 'Temperature',
    field: 'temperature_celsius'
  },
  turbidity: {
    min: 0,
    max: 10, // 10 NTU is typically acceptable
    unit: 'NTU',
    name: 'Turbidity',
    field: 'turbidity_ntu'
  },
  water_level: {
    min: 50, // Minimum water level in cm
    max: 200, // Maximum water level
    unit: 'cm',
    name: 'Water Level',
    field: 'water_level_cm'
  },
  toc: {
    min: 0,
    max: 5, // 5 ppm TOC limit
    unit: 'ppm',
    name: 'Total Organic Carbon',
    field: 'toc_ppm'
  },
  fish_activity: {
    min: 20, // Minimum activity level (percentage)
    max: 100,
    unit: '%',
    name: 'Fish Activity Level',
    field: 'activity_level'
  },
  feeding_response: {
    min: 50, // Minimum strike rate percentage
    max: 100,
    unit: '%',
    name: 'Feeding Response Strike Rate',
    field: 'strike_rate_percent'
  }
};

// Alert contact numbers (can be expanded to multiple contacts)
const ALERT_CONTACTS = [
  "213540392348", // Default contact
  // Add more phone numbers as needed
];

// Alert cooldown period (in minutes) to prevent spam
const ALERT_COOLDOWN = 30;

module.exports = {
  SENSOR_LIMITS,
  ALERT_CONTACTS,
  ALERT_COOLDOWN
};
