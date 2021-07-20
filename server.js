import config from './config.js';
import express from 'express';
import fs from 'fs';
import { $ } from 'zx';

// setup express server
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static('client'));

// logging
async function saveLogs(req, res) {
  const simulationStart = new Date(req.body.logs.simulationStart);
  const logDir = 'logs/';
  const fileExentsion = '.json';
  const filename = simulationStart.toISOString();
  const filepath = logDir + filename + fileExentsion;

  fs.writeFileSync(filepath, JSON.stringify(req.body.logs));
  await $`aws s3 cp ${filepath} s3://cloud-translate-bucket/${filename}`;
  res.json();
}

async function getLogs(_, res) {
  await $`aws s3 sync s3://cloud-translate-bucket logs/`;
  const logDir = './logs';
  const logFilenames = fs.readdirSync(logDir);
  const logFiles = [];

  for (const filename of logFilenames) {
    const file = fs.readFileSync(`${logDir}/${filename}`);
    const fileObj = JSON.parse(file);
    logFiles.push(fileObj);
  }

  res.json(logFiles);
}

// api
app.get('/translatorPort', (_, res) => res.json(config.translatorPort));
app.post('/saveLogs', express.json(), (req, res) => { saveLogs(req, res); });
app.get('/logs', (_, res) => { getLogs(_, res); });

// expose port
const PORT = config.clientPort;
app.listen(PORT, () => console.log(`client started on port ${PORT}`));
