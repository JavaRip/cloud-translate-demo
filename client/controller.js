import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';
const el = {};
let manualTranslator = null;

function runSimulation() {
  const clients = getClients(el.numberOfSpeakers.value);
  const simulation = new Simulator(clients, 50000);
  simulation.init();
}

function getClients(numClients) {
  const clients = [];

  for (let i = 0; i < numClients; i += 1) {
    // select target language at random
    const targetLang = languageCodes[Math.floor(Math.random() * languageCodes.length)].code;

    // translate rate is 1000ms +/- 500ms (randomized)
    const translateRate = 1000 + Math.floor(((Math.random() - 0.5) * 500));
    const newClient = new Client([...textList], getWsAddr(), targetLang, translateRate);
    clients.push(newClient);
  }

  return clients;
}

function initLanguageSelector() {
  for (const language of languageCodes) {
    const optionEl = document.createElement('option');
    optionEl.value = language.code;
    optionEl.textContent = `${language.name} [${language.code}]`;
    el.languageSelector.appendChild(optionEl);
  }
}

function getWsAddr() {
  return 'ws://' + el.translateServerAddr.value;
}

function initElements() {
  el.textToTranslate = document.querySelector('#text-to-translate');
  el.translatedText = document.querySelector('#translated-text');
  el.languageSelector = document.querySelector('#language-selector');
  el.translateServerAddr = document.querySelector('#translate-server-address');
  el.serverAddressUpdate = document.querySelector('#server-address-update');
  el.numberOfSpeakers = document.querySelector('#number-of-speakers');
  el.startSimulation = document.querySelector('#start-simulation');
}

function addEventListeners() {
  el.textToTranslate.addEventListener('keyup', () => {
    manualTranslator.requestTranslation();
  });

  el.languageSelector.addEventListener('change', () => {
    manualTranslator.requestTranslation();
  });

  el.serverAddressUpdate.addEventListener('click', () => {
    manualTranslator.updateWebSocket(getWsAddr());
  });

  el.startSimulation.addEventListener('click', runSimulation);
}

function init() {
  initElements();
  initLanguageSelector();
  el.translateServerAddr.value = window.location.hostname + ':' + window.location.port;
  manualTranslator = new ManualTranslator(
    el.textToTranslate,
    el.translatedText,
    el.languageSelector,
    getWsAddr(),
  );
  addEventListeners();
}

window.addEventListener('load', init);
