const express = require('express');
const cors = require('cors');
const winston = require('winston');
const app = express();
const port = process.env.PORT || 3001;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

app.use(cors());
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

let requestCounter = 0;

app.get('/metrics', (req, res) => {
  requestCounter++;
  const metrics = {
    cpuUsage: (Math.random() * 100).toFixed(2),
    latency: (Math.random() * 450 + 50).toFixed(2),
    memoryUsage: (Math.random() * 80).toFixed(2),
    requestCount: requestCounter,
  };
  logger.info('Metrics requested', { metrics });
  res.json(metrics);
});

app.listen(port, () => {
  logger.info(`Backend running on http://localhost:${port}`);
});