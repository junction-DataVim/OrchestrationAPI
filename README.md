# Aquaculture Pool Monitoring API

A comprehensive REST API for monitoring aquaculture pools and their sensor readings built with Node.js, Express, and Sequelize ORM. This system tracks various water quality parameters and fish activities across multiple pools.

## 🚀 Overview

This API provides real-time monitoring capabilities for aquaculture facilities, tracking essential water quality parameters and fish behavior across multiple pools. The system supports 14 different sensor types and provides endpoints for data collection, retrieval, and analysis.

## 📋 Features

- **Pool Management**: Create, read, update, and delete pool information
- **Multi-Sensor Support**: Monitor 14 different water quality parameters
- **Water Purity Prediction**: ML-based water quality assessment and prediction
- **SMS Alerting System**: Automated SMS alerts when sensor values exceed safe limits
- **Real-time Data**: Track sensor readings with timestamps
- **Latest Readings**: Get the most recent sensor readings for each pool
- **Pool-based Queries**: Retrieve all readings for a specific pool
- **RESTful Architecture**: Clean, predictable API endpoints
- **SQLite Database**: Lightweight, embedded database with Sequelize ORM
- **Data Validation**: Comprehensive input validation and error handling

## � SMS Alerting System

The system includes an automated SMS alerting feature that monitors sensor readings in real-time and sends alerts when values exceed safe operating parameters.

### Key Features:
- **Automatic Monitoring**: All sensor readings are automatically checked against configured thresholds
- **Instant Alerts**: SMS notifications sent immediately when limits are exceeded
- **Spam Prevention**: 30-minute cooldown period prevents alert flooding
- **Multiple Recipients**: Support for multiple phone numbers
- **Comprehensive Coverage**: Monitors all 14 sensor types with appropriate thresholds

### Alert Triggers:
- pH outside 6.5-8.5 range
- Ammonia above 0.25 ppm
- Temperature outside 15-30°C range
- Dissolved oxygen below 5.0 ppm
- And more (see `config/sensor-limits.js` for complete list)

For detailed configuration and usage, see [ALERT_SYSTEM.md](ALERT_SYSTEM.md).

## �🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Development**: Nodemon for hot reloading
- **Environment**: Environment variables support

## 📊 Monitored Parameters

The system tracks the following water quality and fish activity parameters:

### Water Quality Sensors
1. **pH Readings** - Water acidity/alkalinity levels (0-14 scale)
2. **Ammonia Readings** - Toxic ammonia concentration (ppm)
3. **Nitrite Readings** - Nitrite levels (ppm)
4. **Nitrate Readings** - Nitrate concentration (ppm)
5. **Dissolved Oxygen Readings** - Oxygen levels (ppm) and saturation percentage
6. **ORP Readings** - Oxidation-Reduction Potential (mV)
7. **Salinity Readings** - Salt concentration (ppt), conductivity, and TDS
8. **Temperature Readings** - Water temperature (°C)
9. **Turbidity Readings** - Water clarity (NTU)
10. **Water Level Readings** - Water level (cm) and flow rate (LPM)
11. **TOC Readings** - Total Organic Carbon (ppm) and BOD (ppm)

### Fish Activity Sensors
12. **Fish Activity Readings** - Activity level, movement count, and average speed
13. **Feeding Response Readings** - Strike rate, feeding attempts, successful strikes, and response time

### Water Quality Assessment
14. **Water Purity Readings** - Overall water quality assessment with quality rating and percentage scores

## 🗄️ Database Schema

### Pools Table
- `pool_id` (Primary Key, Auto-increment)
- `number_of_fish` (Integer, default: 0)
- `age_of_fish` (Integer, default: 0)
- `capacity_liters` (Integer)
- `name` (String, optional)
- `location` (String, optional)
- `created_at` (DateTime)

### Sensor Reading Tables
Each sensor type has its own table with the following common structure:
- `reading_id` (Primary Key, Auto-increment, BIGINT)
- `pool_id` (Foreign Key to pools table)
- `reading_timestamp` (DateTime, defaults to current time)
- `notes` (Text, optional)
- **Sensor-specific fields** (see individual sensor documentation)

#### Sensor-Specific Fields:
- **pH**: `ph_value` (DECIMAL 4,2)
- **Ammonia**: `ammonia_ppm` (DECIMAL 6,3)
- **Nitrite**: `nitrite_ppm` (DECIMAL 6,3)
- **Nitrate**: `nitrate_ppm` (DECIMAL 6,2)
- **Dissolved Oxygen**: `do_ppm` (DECIMAL 5,2), `do_percent_saturation` (DECIMAL 5,1)
- **ORP**: `orp_mv` (DECIMAL 6,1)
- **Salinity**: `salinity_ppt` (DECIMAL 5,2), `conductivity_us_cm` (DECIMAL 8,1), `tds_ppm` (DECIMAL 8,1)
- **Temperature**: `temperature_celsius` (DECIMAL 4,1)
- **Turbidity**: `turbidity_ntu` (DECIMAL 5,2)
- **Water Level**: `water_level_cm` (DECIMAL 6,1), `flow_rate_lpm` (DECIMAL 8,2)
- **TOC**: `toc_ppm` (DECIMAL 6,2), `bod_ppm` (DECIMAL 6,2)
- **Fish Activity**: `activity_level` (DECIMAL 5,2), `movement_count` (INTEGER), `average_speed` (DECIMAL 5,2)
- **Feeding Response**: `strike_rate_percent` (DECIMAL 5,2), `feeding_attempts` (INTEGER), `successful_strikes` (INTEGER), `response_time_seconds` (DECIMAL 5,2)
- **Water Purity**: `quality` (STRING), `good` (DECIMAL 5,2), `excellent` (DECIMAL 5,2), `poor` (DECIMAL 5,2)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testapi/mainapi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   # or using Sequelize
   npm run init-db-sequelize
   ```

4. **Inject sample data (optional)**
   ```bash
   python3 scripts/inject_dummy_data.py
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000`

## 🌐 API Endpoints

### Pool Management
- `GET /api/pools` - Get all pools (with query parameters: `limit`, `offset`)
- `GET /api/pools/:id` - Get specific pool by ID
- `POST /api/pools` - Create new pool
- `PUT /api/pools/:id` - Update pool (not implemented)
- `DELETE /api/pools/:id` - Delete pool (not implemented)

### Sensor Readings
All sensor endpoints follow the same pattern:
- `GET /api/[sensor-type]-readings` - Get all readings (with query parameters: `pool_id`, `limit`, `offset`)
- `GET /api/[sensor-type]-readings/:pool_id` - Get all readings for specific pool
- `POST /api/[sensor-type]-readings` - Create new reading

#### Available Sensor Endpoints:
- `/api/ph-readings`
- `/api/ammonia-readings`
- `/api/nitrite-readings`
- `/api/nitrate-readings`
- `/api/dissolved-oxygen-readings`
- `/api/orp-readings`
- `/api/salinity-readings`
- `/api/temperature-readings`
- `/api/turbidity-readings`
- `/api/water-level-readings`
- `/api/toc-readings`
- `/api/fish-activity-readings`
- `/api/feeding-response-readings`
- `/api/water-purity-readings`

### Special Endpoints
- `GET /api/current-sensor-values/latest/:pool_id` - Get latest readings from all sensor types for a specific pool
- `GET /api/current-sensor-values/:pool_id/:sensor_type` - Get current sensor value for specific pool and sensor type
- `POST /api/current-sensor-values` - Create/update current sensor value (manual override)
- `GET /api/daily-sensor-summary` - Get daily aggregated statistics (with query parameters: `pool_id`, `sensor_type`, `start_date`, `end_date`)
- `GET /api/daily-sensor-summary/:id` - Get daily sensor summary by ID
- `POST /api/daily-sensor-summary` - Create daily sensor summary

### Water Purity Prediction
- `GET /api/water-purity-readings/latest/:pool_id` - Get latest water purity reading and trigger prediction service
- `GET /api/water-purity-readings/:pool_id` - Get all water purity readings for a specific pool
- `GET /api/water-purity-readings` - Get all water purity readings (supports pagination)
- `POST /api/water-purity-readings` - Create new water purity reading

**Note**: The water purity prediction endpoint integrates with an external machine learning service to analyze water quality based on sensor readings.

## 📝 API Usage Examples

### Create a New Pool
```bash
curl -X POST http://localhost:3000/api/pools \
  -H "Content-Type: application/json" \
  -d '{
    "number_of_fish": 100,
    "age_of_fish": 6,
    "capacity_liters": 10000,
    "name": "Tank A",
    "location": "Building 1"
  }'
```

### Add a pH Reading
```bash
curl -X POST http://localhost:3000/api/ph-readings \
  -H "Content-Type: application/json" \
  -d '{
    "pool_id": 1,
    "ph_value": 7.2,
    "notes": "Normal pH level"
  }'
```

### Add a Dissolved Oxygen Reading
```bash
curl -X POST http://localhost:3000/api/dissolved-oxygen-readings \
  -H "Content-Type: application/json" \
  -d '{
    "pool_id": 1,
    "do_ppm": 8.5,
    "do_percent_saturation": 95.2
  }'
```

### Add a Water Purity Reading
```bash
curl -X POST http://localhost:3000/api/water-purity-readings \
  -H "Content-Type: application/json" \
  -d '{
    "pool_id": 1,
    "quality": "good",
    "good": 75.5,
    "excellent": 20.2,
    "poor": 4.3
  }'
```

### Get All Readings for a Pool
```bash
curl http://localhost:3000/api/ph-readings/1
```

### Get Water Purity Readings for a Pool
```bash
curl http://localhost:3000/api/water-purity-readings/1
```

### Get Latest Water Purity Reading with Prediction
```bash
curl http://localhost:3000/api/water-purity-readings/latest/1
```

### Get Latest Sensor Readings for a Pool
```bash
curl http://localhost:3000/api/current-sensor-values/latest/1
```

### Get Daily Summary
```bash
curl "http://localhost:3000/api/daily-sensor-summary?pool_id=1&sensor_type=ph"
```

### Query with Pagination
```bash
curl "http://localhost:3000/api/ph-readings?pool_id=1&limit=50&offset=0"
```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reloading
- `npm run init-db` - Initialize the database (SQLite legacy script)
- `npm run init-db-sequelize` - Initialize the database using Sequelize models
- `npm run init-db-bash` - Initialize the database (Bash script)
- `npm run wipe-db` - Wipe and recreate the database
- `npm test` - Run tests (not implemented yet)

## 🏗️ Project Structure

```
mainapi/
├── app.js                 # Main application file
├── package.json          # Dependencies and scripts
├── ALERT_SYSTEM.md       # SMS alerting system documentation
├── controllers/          # Business logic controllers
│   ├── SMS-API.js        # SMS alert functionality
│   └── water-purity.js   # Water purity prediction
├── middleware/           # Express middleware
│   └── sensor-alerts.js  # Sensor monitoring and alerting
├── config/               # Configuration files
│   └── sensor-limits.js  # Sensor thresholds and alert settings
├── database/
│   ├── database.js       # Sequelize models and database connection
│   └── pool_sensors.db   # SQLite database file
├── models/               # Individual model files (legacy)
│   ├── Pool.js
│   ├── PhReading.js
│   └── [other sensor models]
├── routes/               # API route handlers
│   ├── pools.js
│   ├── ph-readings.js
│   ├── water-purity-readings.js
│   ├── current-sensor-values.js
│   ├── daily-sensor-summary.js
│   └── [other sensor routes]
└── scripts/              # Database and utility scripts
    ├── init-db.js
    ├── init-db-sequelize.js
    ├── init-db.sh
    ├── wipe-and-recreate-db.js
    └── inject_dummy_data.py
```

## 🔍 Data Validation

The API includes comprehensive data validation:
- **Pool ID**: Must exist in the pools table for all sensor readings
- **Sensor Values**: Must be within realistic ranges for each sensor type
  - pH: 0-14 range
  - Temperature: Reasonable aquaculture ranges
  - PPM values: Non-negative numbers
  - Percentages: 0-100 range for saturation values
  - Quality ratings: Must be valid quality levels (e.g., "excellent", "good", "poor")
  - Purity percentages: Sum of good, excellent, and poor should be approximately 100%
- **Required Fields**: Pool ID and primary sensor value are required
- **Data Types**: Proper decimal precision for each measurement type
- **Timestamps**: Automatically generated if not provided
- **Foreign Key Constraints**: Enforced through Sequelize associations

## 📊 Monitoring & Logging

- Database queries can be logged (configured in database/database.js)
- Error handling middleware for graceful error responses
- 404 handler for undefined routes
- Console logging for server status and errors
- Debug logging available for sensor reading retrieval

## 🚨 Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success (data retrieved)
- `201` - Created (new resource created)
- `400` - Bad Request (validation errors, missing required fields)
- `404` - Not Found (resource doesn't exist, no readings found)
- `500` - Internal Server Error (database or server errors)

### Error Response Format
```json
{
  "error": "Descriptive error message"
}
```

### Common Error Scenarios
- Pool not found when creating sensor readings
- Invalid sensor values (negative numbers, out of range)
- Missing required fields in POST requests
- Database connection issues

## 🧪 Testing

You can test the API using several methods:

### Automated Data Injection
Use the included Python script to inject realistic dummy data:
```bash
python3 scripts/inject_dummy_data.py
```

### Manual Testing
Use curl, Postman, Insomnia, or any HTTP client:
```bash
# Test pool creation
curl -X POST http://localhost:3000/api/pools \
  -H "Content-Type: application/json" \
  -d '{"number_of_fish": 50, "capacity_liters": 5000}'

# Test sensor reading creation
curl -X POST http://localhost:3000/api/ph-readings \
  -H "Content-Type: application/json" \
  -d '{"pool_id": 1, "ph_value": 7.0}'

# Test data retrieval
curl http://localhost:3000/api/current-sensor-values/latest/1
```

### Sample Data
The dummy data injector creates:
- 4 pools with varying configurations
- 20 readings per sensor type per pool
- Realistic sensor values within appropriate ranges
- Covers all 14 sensor types including water purity assessments

## 📈 Performance Considerations

- **Database Indexes**: Optimized queries with composite indexes on frequently queried fields
  - `(pool_id, reading_timestamp)` for time-based queries
  - `(pool_id, reading_timestamp, sensor_value)` for value-based filtering
- **Pagination**: Limit and offset support for large datasets (default limit: 100)
- **Efficient Queries**: Sequelize ORM with proper associations and eager loading
- **Lightweight Database**: SQLite for fast operations and easy deployment
- **Connection Management**: Handled automatically by Sequelize
- **Memory Usage**: Optimized with proper query limits and selective field loading

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                # Server port (default: 3000)
NODE_ENV=development     # Environment mode
```

### Database Configuration
- **Database Type**: SQLite
- **Database File**: `database/pool_sensors.db`
- **Connection**: Managed by Sequelize
- **Logging**: Disabled by default (can be enabled in database.js)

### Sequelize Configuration
```javascript
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'pool_sensors.db'),
    logging: false, // Set to console.log to see SQL queries
    define: {
        timestamps: false // Manual timestamp handling
    }
});
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-sensor`)
3. Commit your changes (`git commit -am 'Add new sensor type'`)
4. Push to the branch (`git push origin feature/new-sensor`)
5. Create a Pull Request

## 📞 Support

For issues and questions, please create an issue in the repository.

## 🔮 Future Enhancements

- Authentication and authorization system
- Real-time data streaming with WebSockets
- Advanced data aggregation and analytics endpoints
- Alerting system for critical sensor values
- Data export functionality (CSV, JSON)
- Web dashboard interface
- Mobile app support
- Data backup and restore functionality
- Multi-database support (PostgreSQL, MySQL)
- Docker containerization
- API rate limiting
- Sensor calibration management
- Historical data archiving

## � Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)

---

**Last Updated**: July 2025  
**API Version**: 1.0.0  
**Database Version**: SQLite with Sequelize ORM

For more information or support, please contact the development team.
