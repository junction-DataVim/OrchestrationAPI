# Route Summary - Aquaculture Monitoring System API

## Base URL: `http://localhost:3000/api`

## 🏊 Pool Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pools` | Get all pools |
| POST | `/pools` | Create a new pool |
| GET | `/pools/{id}` | Get pool by ID |
| PUT | `/pools/{id}` | Update pool |

## 🌡️ Sensor Readings (All follow same pattern)

### Available Sensor Types:
- `ph-readings` - pH levels (0-14)
- `temperature-readings` - Temperature (°C)
- `ammonia-readings` - Ammonia levels (PPM)
- `nitrite-readings` - Nitrite levels (PPM)
- `nitrate-readings` - Nitrate levels (PPM)
- `dissolved-oxygen-readings` - Dissolved oxygen (PPM)
- `orp-readings` - Oxidation-reduction potential (mV)
- `salinity-readings` - Salinity (PPT)
- `turbidity-readings` - Turbidity (NTU)
- `water-level-readings` - Water level (cm) & flow rate (LPM)
- `toc-readings` - Total organic carbon (PPM)
- `fish-activity-readings` - Fish behavior metrics
- `feeding-response-readings` - Feeding response metrics

### Sensor Endpoints Pattern:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{sensor-type}` | Get all readings (with filtering) |
| POST | `/{sensor-type}` | Create new reading |
| GET | `/{sensor-type}/{pool_id}` | Get readings for specific pool |

**Query Parameters for GET requests:**
- `pool_id` - Filter by pool ID
- `limit` - Number of records (default: 100)
- `offset` - Skip records (default: 0)

## 📊 Current Values & Summaries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/current-sensor-values/latest/{pool_id}` | Get latest readings from all sensors |
| GET | `/daily-sensor-summary` | Get daily aggregated data |
| POST | `/daily-sensor-summary` | Create daily summary |
| GET | `/daily-sensor-summary/{id}` | Get specific daily summary |

**Query Parameters for daily summaries:**
- `pool_id` - Filter by pool ID
- `sensor_type` - Filter by sensor type
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)
- `limit` - Number of records (default: 100)
- `offset` - Skip records (default: 0)

## 💧 Water Quality
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/water-purity-readings` | Get all water purity readings |
| GET | `/water-purity-readings/pool/{pool_id}` | Get readings for specific pool |
| GET | `/water-purity-readings/pool/{pool_id}/latest` | Get latest calculation |

## ⚙️ Configuration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/norms` | Get sensor limits/thresholds |
| PUT | `/norms` | Update sensor limits/thresholds |

## 📝 Documentation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api-docs` | Interactive Swagger UI documentation |
| GET | `/docs` | Redirect to API documentation |

## 🔍 Common Response Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## 📋 Example Requests

### Create Pool
```bash
POST /api/pools
{
  "number_of_fish": 150,
  "age_of_fish": 30,
  "capacity_liters": 5000,
  "name": "Main Tank A",
  "location": "Building 1"
}
```

### Add Temperature Reading
```bash
POST /api/temperature-readings
{
  "pool_id": 1,
  "temperature_celsius": 24.5,
  "notes": "Morning reading"
}
```

### Get Latest Sensor Values
```bash
GET /api/current-sensor-values/latest/1
```

### Get Daily Summary
```bash
GET /api/daily-sensor-summary?pool_id=1&sensor_type=temperature&start_date=2024-01-01
```

## 🎯 Quick Start
1. Start server: `npm start`
2. View documentation: http://localhost:3000/api-docs
3. Test endpoints: Use Swagger UI or curl
4. Create pools first, then add sensor readings

## 🔧 Development
- Base URL: http://localhost:3000/api
- Interactive docs: http://localhost:3000/api-docs
- All responses are JSON
- All timestamps are ISO 8601 format
- Automatic validation on all inputs
