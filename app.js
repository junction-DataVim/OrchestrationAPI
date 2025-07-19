const express = require('express');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./database/database');
const cron = require('node-cron')
const waterPurityController = require('./controllers/water-purity');
const {Pool} = require('./database/database');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Aquaculture Monitoring API Documentation"
}));

// API Documentation redirect
app.get('/docs', (req, res) => {
  res.redirect('/api-docs');
});

// Schedule a task to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  pools = await Pool.findAll();
  pools.forEach(pool => {
    waterPurityController.water_purity(pool.pool_id)
      .then(response => {
        console.log(`Water purity for pool ${pool.pool_id} updated successfully.`);
      })
      .catch(error => {
        console.error(`Error updating water purity for pool ${pool.pool_id}:`, error);
      });
  }
)});

// Routes
app.use('/api/pools', require('./routes/pools'));
app.use('/api/ph-readings', require('./routes/ph-readings'));
app.use('/api/ammonia-readings', require('./routes/ammonia-readings'));
app.use('/api/nitrite-readings', require('./routes/nitrite-readings'));
app.use('/api/nitrate-readings', require('./routes/nitrate-readings'));
app.use('/api/dissolved-oxygen-readings', require('./routes/dissolved-oxygen-readings'));
app.use('/api/orp-readings', require('./routes/orp-readings'));
app.use('/api/salinity-readings', require('./routes/salinity-readings'));
app.use('/api/temperature-readings', require('./routes/temperature-readings'));
app.use('/api/turbidity-readings', require('./routes/turbidity-readings'));
app.use('/api/water-level-readings', require('./routes/water-level-readings'));
app.use('/api/toc-readings', require('./routes/toc-readings'));
app.use('/api/fish-activity-readings', require('./routes/fish-activity-readings'));
app.use('/api/feeding-response-readings', require('./routes/feeding-response-readings'));
app.use('/api/bacteria-density-readings', require('./routes/bacteria-density-readings'));
app.use('/api/current-sensor-values', require('./routes/current-sensor-values'));
app.use('/api/daily-sensor-summary', require('./routes/daily-sensor-summary'));
app.use('/api/water-purity-readings', require('./routes/water-purity'));
app.use('/api/norms', require('./routes/norms'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
