# Sensor Alerting System Documentation

## Overview

The aquaculture monitoring system includes an automated SMS alerting system that monitors sensor readings in real-time and sends SMS alerts when values exceed safe operating parameters.

## How It Works

1. **Middleware Integration**: The `sensorAlertMiddleware` is integrated into the Express.js application and monitors all POST requests to sensor reading endpoints.

2. **Automatic Monitoring**: When new sensor readings are posted via the API, the middleware automatically checks if the values are within acceptable limits.

3. **SMS Alerts**: If a reading exceeds the configured thresholds, the system automatically sends SMS alerts to configured phone numbers.

4. **Spam Prevention**: The system includes a cooldown period (default: 30 minutes) to prevent alert spam for the same sensor/pool combination.

## Configuration

### Sensor Limits

Sensor thresholds are configured in `/config/sensor-limits.js`. Current limits include:

| Sensor Type | Minimum | Maximum | Unit | Field Name |
|-------------|---------|---------|------|------------|
| pH | 6.5 | 8.5 | - | ph_value |
| Ammonia | 0 | 0.25 | ppm | ammonia_ppm |
| Nitrite | 0 | 0.5 | ppm | nitrite_ppm |
| Nitrate | 0 | 40 | ppm | nitrate_ppm |
| Dissolved Oxygen | 5.0 | 15.0 | ppm | do_ppm |
| ORP | 300 | 500 | mV | orp_mv |
| Salinity | 0 | 35 | ppt | salinity_ppt |
| Temperature | 15 | 30 | °C | temperature_celsius |
| Turbidity | 0 | 10 | NTU | turbidity_ntu |
| Water Level | 50 | 200 | cm | water_level_cm |
| TOC | 0 | 5 | ppm | toc_ppm |
| Fish Activity | 20 | 100 | % | activity_level |
| Feeding Response | 50 | 100 | % | strike_rate_percent |

### Contact Configuration

SMS alert recipients are configured in the `ALERT_CONTACTS` array in `/config/sensor-limits.js`:

```javascript
const ALERT_CONTACTS = [
  "213784127256", // Default contact
  // Add more phone numbers as needed
];
```

### Cooldown Period

The alert cooldown period is configurable (default: 30 minutes):

```javascript
const ALERT_COOLDOWN = 30; // minutes
```

## SMS Service Configuration

The system uses Infobip SMS API. Configuration is in `/controllers/SMS-API.js`:

- **Authorization**: Pre-configured API key
- **From Number**: 447491163443
- **API Endpoint**: https://api.infobip.com/sms/2/text/advanced

## Alert Message Format

SMS alerts include:
- Alert type and severity indicator (🚨)
- Pool ID
- Sensor name
- Current value and status (too high/too low)
- Acceptable range
- Call to action

Example:
```
🚨 AQUACULTURE ALERT 🚨

Pool ID: 1
Sensor: pH Level
Status: TOO HIGH (9.5 > 8.5)
Acceptable Range: 6.5-8.5

Immediate attention required!
```

## Testing the System

### 1. Unit Tests
Run the test script to verify components:
```bash
node test-alerts.js
```

### 2. Integration Demo
Test with actual API calls (requires running server):
```bash
node demo-alerts.js
```

### 3. Manual Testing
Send a test reading that exceeds limits:
```bash
curl -X POST http://localhost:3000/api/ph-readings \
  -H "Content-Type: application/json" \
  -d '{
    "pool_id": 1,
    "ph_value": 9.5,
    "notes": "Test alert - pH too high"
  }'
```

## Files Structure

```
mainapi/
├── controllers/
│   └── SMS-API.js              # SMS sending functionality
├── middleware/
│   └── sensor-alerts.js        # Alert monitoring middleware
├── config/
│   └── sensor-limits.js        # Sensor thresholds and configuration
├── test-alerts.js              # Unit test script
├── demo-alerts.js              # Integration demo script
└── app.js                      # Main app with middleware integration
```

## Monitoring and Logs

The system provides comprehensive logging:

- **Success logs**: Confirmation when alerts are sent
- **Error logs**: Failed SMS attempts or system errors
- **Debug logs**: Sensor value checks and cooldown status

## Customization

### Adding New Sensor Types
1. Add sensor limits to `SENSOR_LIMITS` in `/config/sensor-limits.js`
2. Update the route mapping in `getSensorTypeFromPath()` function
3. Test with new sensor readings

### Modifying Alert Thresholds
Edit the values in `/config/sensor-limits.js` and restart the server.

### Adding Alert Recipients
Add phone numbers to the `ALERT_CONTACTS` array in `/config/sensor-limits.js`.

### Changing Alert Cooldown
Modify the `ALERT_COOLDOWN` value in `/config/sensor-limits.js`.

## Security Considerations

- API keys should be moved to environment variables in production
- Phone numbers should be validated before adding to contact list
- Consider implementing rate limiting for API endpoints
- Log all alert activities for audit purposes

## Troubleshooting

### Common Issues

1. **SMS not sending**
   - Check API key validity
   - Verify phone number format (international format without +)
   - Check network connectivity

2. **No alerts triggered**
   - Verify sensor limits configuration
   - Check if values actually exceed thresholds
   - Confirm middleware is properly integrated

3. **Too many alerts**
   - Increase cooldown period
   - Review threshold values
   - Check for sensor calibration issues

### Debug Mode

Enable debug logging by modifying the middleware to log all sensor checks:

```javascript
console.log(`Checking ${sensorType}: ${sensorValue} (limits: ${limits.min}-${limits.max})`);
```

## Future Enhancements

- Email alerts in addition to SMS
- Alert escalation (multiple attempts)
- Alert acknowledgment system
- Dashboard for alert history
- Integration with external monitoring systems
- Predictive alerting based on trends
