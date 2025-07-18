const express = require('express');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./database/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

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
app.use('/api/current-sensor-values', require('./routes/current-sensor-values'));
app.use('/api/daily-sensor-summary', require('./routes/daily-sensor-summary'));

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
