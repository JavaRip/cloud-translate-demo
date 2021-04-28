// code adapted from https://cloud.google.com/translate/docs/basic/translating-text#translate_translate_text-nodejs
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;
const ws = require('ws');
const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 9999;
const app = express();
app.use(express.static('client'));
const server = http.createServer(app);

// put filepath to your credentials here
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'api_key/cloud_translation_api_key.json';

// Creates a client
const translate = new Translate();

async function translateText(text, target) {
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  return translations[0];
}

function listener(socket) {
  socket.on('message', async (msg) => {
    const msgObj = JSON.parse(msg);
    const translation = await translateText(msgObj.text, msgObj.target);
    socket.send(translation);
  });
}

const wsServer = new ws.Server({ server: server });
wsServer.on('connection', listener);

server.listen(PORT, () => console.log(`server started on port ${PORT}`));
