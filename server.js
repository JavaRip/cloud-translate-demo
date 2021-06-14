// code adapted from https://cloud.google.com/translate/docs/basic/translating-text#translate_translate_text-nodejs
// Imports the Google Cloud client library
import ws from 'ws';
import express from 'express';
import http from 'http';
import fs from 'fs';
import Translate from '@google-cloud/translate';
const translator = new Translate.v2.Translate();

// setup express server
const app = express();
app.use(express.static('client'));
const server = http.createServer(app);

// create api key file for GOOGLE_APPLICATION_CREDENTIALS
// if file does not already exist
// or if contents of api file does not match env variable
if (!fs.existsSync('api_key.json')) {
  fs.writeFileSync('api_key.json', process.env.GOOGLE_APPLICATION_KEY);
} else {
  if (fs.readFileSync('api_key.json', 'utf8') !== process.env.GOOGLE_APPLICATION_KEY) {
    console.log('application key updated');
    fs.writeFileSync('api_key.json', process.env.GOOGLE_APPLICATION_KEY);
  }
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'api_key.json';

// websocket functions
async function translateText(text, target) {
  let [translations] = await translator.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  return { translation: translations[0], original: text };
}

function listener(socket) {
  socket.on('message', async (msg) => {
    const msgObj = JSON.parse(msg);
    const translation = await translateText(msgObj.text, msgObj.target);
    socket.send(JSON.stringify(translation));
  });
}

// websocket init
const wsServer = new ws.Server({ server: server });
wsServer.on('connection', listener);

// expose ports and websocket
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => console.log(`server started on port ${PORT}`));
