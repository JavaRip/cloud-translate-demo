let WS;
const EL = {};

function toServer() {
  WS.send(JSON.stringify({
    text: EL.textToTranslate.value,
    target: EL.languageSelector.value
  }));
}

function fromServer(event) {
  EL.translatedText.textContent = event.data;
}

function updateWebSocket() {
  WS = new WebSocket('ws://' + EL.translateServerAddress.value);
  WS.addEventListener('message', fromServer);
}

function runSimulation() {
  const clients = [];
  const numberOfClients = EL.numberOfSpeakers.value;
  const translatorWebsocket = 'ws://' + EL.translateServerAddress.value;
  const targetLanguage = 'de';
  const thingsToTranslate = [
    'hello there',
    'thanks for reading the nonsense I am writing',
    'Really I am flattered and surprised! That you made it this far',
    'I would put something entertaining here',
    'but I would not want to encourage you to waste your time',
    'I did hear a good joke the othe day but I cannot quite remember how it went',
    'I think it was something like',
    'I actually really cannot remember lol but it was pretty good',
    'anyway I do remember one I have just told it a million times already to everyone',
    'what kind of tree can you fit in your hand?',
    'a palm tree',
  ];
  for (let i = 0; i < numberOfClients; i += 1) {
    const newClient = new client(thingsToTranslate, translatorWebsocket, targetLanguage);
    newClient.init();
    clients.push(newClient);
  }
}

function initElements() {
  EL.textToTranslate = document.querySelector('#text-to-translate');
  EL.translatedText = document.querySelector('#translated-text');
  EL.languageSelector = document.querySelector('#language-selector');
  EL.translateServerAddress = document.querySelector('#translate-server-address');
  EL.serverAddressUpdate = document.querySelector('#server-address-update');
  EL.numberOfSpeakers = document.querySelector('#number-of-speakers');
  EL.startSimulation = document.querySelector('#start-simulation');
}

function addEventListeners() {
  EL.textToTranslate.addEventListener('keyup', toServer);
  EL.languageSelector.addEventListener('change', toServer);
  EL.serverAddressUpdate.addEventListener('click', updateWebSocket);
  EL.startSimulation.addEventListener('click', runSimulation);
}

function init() {
  initElements();
  EL.translateServerAddress.value = window.location.hostname + ':' + (window.location.port || '80');
  addEventListeners();
  updateWebSocket();
}

window.addEventListener('load', init)

class client {
  constructor(textArray, translatorWebsocket, targetLanguage) {
    this.textArray = textArray ; // lines of text to send to translator
    this.translatorWebsocket = translatorWebsocket;
    this.targetLanguage = targetLanguage;
    this.translations = [];
  }

  init() {
    this.ws = new WebSocket(this.translatorWebsocket);
    this.ws.addEventListener('open', () => { this.openWebsocket() });
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event) });
  }

  openWebsocket() {
    for (const text of this.textArray) {
      this.requestTranslation(text);
    }
  }

  requestTranslation(text) {
    this.ws.send(JSON.stringify({
      text: text,
      target: this.targetLanguage,
    }));
  }

  receiveTranslation(event) {
    this.translations.push(event.data);
    console.log(event.data);
  }
}

