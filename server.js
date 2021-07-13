import config from './config.js';
import express from 'express';
import fs from 'fs';

// setup express server
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static('client'));

// logging
function saveLogs(req, res) {
  const simulationStart = new Date(req.body.logs.simulationStart);
  const logDir = 'logs/';
  const fileExentsion = '.json';
  const filepath = logDir + simulationStart.toISOString() + fileExentsion;

  fs.writeFileSync(filepath, JSON.stringify(req.body.logs));
  res.json();
}

// api
app.get('/translatorPort', (_, res) => res.json(config.translatorPort));
app.post('/saveLogs', express.json(), (req, res) => { saveLogs(req, res); });

// expose port
const PORT = config.clientPort;
app.listen(PORT, () => console.log(`client started on port ${PORT}`));
