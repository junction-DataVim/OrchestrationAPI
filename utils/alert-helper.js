const { send_alert } = require('../controllers/SMS-API');
const { SENSOR_LIMITS, ALERT_CONTACTS, ALERT_COOLDOWN } = require('../config/sensor-limits');

// Store last alert times to prevent spam
const lastAlertTimes = new Map();

// Check if enough time has passed since last alert for this sensor/pool combination
const canSendAlert = (sensorType, poolId) => {
  const alertKey = `${sensorType}-${poolId}`;
  const lastAlertTime = lastAlertTimes.get(alertKey);
  
  if (!lastAlertTime) {
    return true;
  }
  
  const timeDiff = Date.now() - lastAlertTime;
  const cooldownMs = ALERT_COOLDOWN * 60 * 1000; // Convert minutes to milliseconds
  
  return timeDiff > cooldownMs;
};

// Update last alert time
const updateLastAlertTime = (sensorType, poolId) => {
  const alertKey = `${sensorType}-${poolId}`;
  lastAlertTimes.set(alertKey, Date.now());
};

// Check if a sensor value is outside acceptable limits
const checkSensorLimits = (sensorType, value, poolId) => {
  const limits = SENSOR_LIMITS[sensorType];
  if (!limits) {
    return null; // No limits defined for this sensor type
  }

  if (value < limits.min || value > limits.max) {
    return {
      isAlert: true,
      value,
      min: limits.min,
      max: limits.max,
      unit: limits.unit,
      name: limits.name,
      poolId
    };
  }

  return null;
};

// Generate alert message
const generateAlertMessage = (alertInfo) => {
  const { name, value, min, max, unit, poolId } = alertInfo;
  
  let condition = '';
  if (value < min) {
    condition = `TOO LOW (${value}${unit} < ${min}${unit})`;
  } else if (value > max) {
    condition = `TOO HIGH (${value}${unit} > ${max}${unit})`;
  }
  
  return `🚨 AQUACULTURE ALERT 🚨\n\nPool ID: ${poolId}\nSensor: ${name}\nStatus: ${condition}\nAcceptable Range: ${min}-${max}${unit}\n\nImmediate attention required!`;
};

// Main function to check and send alerts
const checkAndSendAlert = async (sensorType, sensorValue, poolId) => {
  try {
    console.log(`Checking alert for ${sensorType}: ${sensorValue} (Pool: ${poolId})`);
    
    const alertInfo = checkSensorLimits(sensorType, sensorValue, poolId);
    
    if (alertInfo && canSendAlert(sensorType, poolId)) {
      console.log(`Alert triggered for ${sensorType}: ${sensorValue}`);
      const message = generateAlertMessage(alertInfo);
      
      // Send alert to all configured contacts
      for (const phoneNumber of ALERT_CONTACTS) {
        try {
          const result = await send_alert(message, phoneNumber);
          if (result.success) {
            console.log(`✅ Alert sent successfully to ${phoneNumber} for Pool ${poolId}, ${alertInfo.name}: ${sensorValue}${alertInfo.unit}`);
          } else {
            console.error(`❌ Failed to send alert to ${phoneNumber}:`, result.error);
          }
        } catch (error) {
          console.error(`❌ Error sending alert to ${phoneNumber}:`, error);
        }
      }
      
      // Update last alert time to prevent spam
      updateLastAlertTime(sensorType, poolId);
    } else if (alertInfo) {
      console.log(`Alert suppressed due to cooldown for ${sensorType} in pool ${poolId}`);
    } else {
      console.log(`No alert needed for ${sensorType}: ${sensorValue} (within limits)`);
    }
  } catch (error) {
    console.error('Error in checkAndSendAlert:', error);
  }
};

module.exports = {
  checkAndSendAlert,
  checkSensorLimits,
  generateAlertMessage,
  canSendAlert,
  updateLastAlertTime
};
