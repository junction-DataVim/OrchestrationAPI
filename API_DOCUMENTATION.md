# Aquaculture Monitoring System API

A comprehensive REST API for monitoring aquaculture pools and sensor readings. This system tracks various water quality parameters, fish behavior, and environmental conditions to help maintain optimal conditions for aquaculture operations.

## 🚀 Features

- **Pool Management**: Create, read, update pools with fish and capacity information
- **Multi-Sensor Monitoring**: Track 13+ different sensor types including water quality, fish behavior, and environmental parameters
- **Real-time Data**: Get current sensor values and latest readings
- **Data Aggregation**: Daily sensor summaries with min/max/average values
- **Alert System**: Configurable sensor limits and thresholds
- **Water Quality Assessment**: Automated water purity calculations
- **Interactive API Documentation**: Swagger UI for easy API exploration

## 📊 Monitored Parameters

### Water Quality Sensors
- **pH** - Water acidity/alkalinity (0-14 scale)
- **Ammonia** - Toxic ammonia levels (PPM)
- **Nitrite** - Nitrite nitrogen levels (PPM)
- **Nitrate** - Nitrate nitrogen levels (PPM)
- **Dissolved Oxygen** - Oxygen levels (PPM) and saturation percentage
- **ORP** - Oxidation-reduction potential (mV)
- **Salinity** - Salt concentration (PPT)
- **Temperature** - Water temperature (°C)
- **Turbidity** - Water clarity (NTU)
- **TOC** - Total Organic Carbon (PPM)
- **Water Level** - Water height (cm) and flow rate (LPM)

### Biological Monitoring
- **Fish Activity** - Activity level, movement count, and speed
- **Feeding Response** - Strike rate percentage and response time
- **Water Purity** - Calculated overall water quality assessment

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mainapi
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize the database**
```bash
npm run init-db
```

4. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📝 API Documentation

### Interactive Documentation
Once the server is running, access the interactive Swagger UI documentation at:
- **Full Documentation**: http://localhost:3000/api-docs
- **Quick Access**: http://localhost:3000/docs

### Base URL
```
http://localhost:3000/api
```

## 🔗 API Endpoints Overview

### Pool Management
- `GET /api/pools` - Get all pools
- `POST /api/pools` - Create a new pool
- `GET /api/pools/{id}` - Get pool by ID
- `PUT /api/pools/{id}` - Update pool

### Sensor Readings
Each sensor type follows the same pattern:
- `GET /api/{sensor-type}-readings` - Get all readings (with filtering)
- `POST /api/{sensor-type}-readings` - Create new reading
- `GET /api/{sensor-type}-readings/{pool_id}` - Get readings for specific pool

**Available sensor types:**
- `ph-readings`
- `temperature-readings`
- `ammonia-readings`
- `nitrite-readings`
- `nitrate-readings`
- `dissolved-oxygen-readings`
- `orp-readings`
- `salinity-readings`
- `turbidity-readings`
- `water-level-readings`
- `toc-readings`
- `fish-activity-readings`
- `feeding-response-readings`

### Current Values & Summaries
- `GET /api/current-sensor-values/latest/{pool_id}` - Get latest readings from all sensors
- `GET /api/daily-sensor-summary` - Get daily aggregated data
- `POST /api/daily-sensor-summary` - Create daily summary

### Water Quality
- `GET /api/water-purity-readings` - Get all water purity readings
- `GET /api/water-purity-readings/pool/{pool_id}` - Get readings for specific pool
- `GET /api/water-purity-readings/pool/{pool_id}/latest` - Get latest calculation

### Configuration
- `GET /api/norms` - Get sensor limits/thresholds
- `PUT /api/norms` - Update sensor limits/thresholds

## 📋 Common Query Parameters

Most GET endpoints support these parameters:
- `pool_id` - Filter by pool ID
- `limit` - Number of records to return (default: 100)
- `offset` - Number of records to skip (default: 0)
- `start_date` - Start date filter (YYYY-MM-DD)
- `end_date` - End date filter (YYYY-MM-DD)

## 🔧 Configuration

### Database
The system uses SQLite by default. Database files are stored in the `database/` directory.

### Sensor Limits
Configure sensor thresholds via the `/api/norms` endpoint. The system will trigger alerts when readings exceed these limits.

### Automated Tasks
- Water purity calculations run every 5 minutes automatically
- Daily summaries can be generated via API calls

## 📤 Example Requests

### Create a New Pool
```bash
curl -X POST http://localhost:3000/api/pools \
  -H "Content-Type: application/json" \
  -d '{
    "number_of_fish": 150,
    "age_of_fish": 30,
    "capacity_liters": 5000,
    "name": "Main Tank A",
    "location": "Building 1"
  }'
```

### Add a Temperature Reading
```bash
curl -X POST http://localhost:3000/api/temperature-readings \
  -H "Content-Type: application/json" \
  -d '{
    "pool_id": 1,
    "temperature_celsius": 24.5,
    "notes": "Morning reading"
  }'
```

### Get Latest Sensor Values
```bash
curl http://localhost:3000/api/current-sensor-values/latest/1
```

### Get Daily Summary
```bash
curl "http://localhost:3000/api/daily-sensor-summary?pool_id=1&sensor_type=temperature&start_date=2024-01-01"
```

## 🔄 Response Format

All responses are in JSON format:

**Success Response:**
```json
{
  "reading_id": 1,
  "pool_id": 1,
  "temperature_celsius": 24.5,
  "reading_timestamp": "2024-01-15T10:30:00.000Z",
  "Pool": {
    "pool_id": 1,
    "name": "Main Tank A",
    "capacity_liters": 5000
  }
}
```

**Error Response:**
```json
{
  "error": "Pool not found"
}
```

## 🚨 Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 📊 Data Validation

### Temperature Readings
- Range: -5°C to 50°C
- Required: `pool_id`, `temperature_celsius`

### pH Readings
- Range: 0-14
- Required: `pool_id`, `ph_value`

### General Sensor Readings
- All readings require valid `pool_id`
- Timestamps are automatically generated
- Notes are optional for all readings

## 🔍 Monitoring & Alerts

The system includes an alert system that:
- Monitors sensor readings against configured limits
- Triggers alerts when thresholds are exceeded
- Supports SMS notifications (see SMS_IMPLEMENTATION_SUMMARY.md)
- Provides configurable sensor limits via the norms endpoint

## 📱 Integration

### Frontend Integration
The API is designed to work with web dashboards, mobile apps, and IoT devices. All endpoints return JSON and support CORS.

### IoT Device Integration
Sensors can POST readings directly to the appropriate endpoints. The system handles validation and alert triggering automatically.

### Data Export
Use the daily summary endpoints to export aggregated data for reporting and analysis.

## 🛡️ Security

- Input validation on all endpoints
- SQL injection protection via Sequelize ORM
- Error handling to prevent information leakage
- Rate limiting can be implemented via middleware

## 🔧 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run init-db` - Initialize database
- `npm run wipe-db` - Wipe and recreate database

### Database Management
- `node scripts/inject_dummy_data.py` - Add test data
- Database schemas are managed via Sequelize

### Testing
API endpoints can be tested using:
- Swagger UI (http://localhost:3000/api-docs)
- Postman
- curl commands
- Automated test scripts

## 📞 Support

For technical support or questions:
- Check the interactive API documentation at `/api-docs`
- Review the code in the `routes/` directory
- Check the alert system documentation in `ALERT_SYSTEM.md`
- Review SMS implementation in `SMS_IMPLEMENTATION_SUMMARY.md`

## 🚀 Deployment

The application can be deployed to any Node.js hosting platform:
- Set `PORT` environment variable
- Ensure database directory is writable
- Configure any required environment variables
- Use `npm start` to run in production

## 🔄 Version

Current version: 1.0.0

This API is actively maintained and regularly updated with new features and improvements.
