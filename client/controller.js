import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { languages as LANGUAGECODES } from './data/languageCodes.js';
import { textList as TEXTLIST } from './data/sampleTexts.js';
const EL = {};
let MANUALTRANSLATOR = null;

function runSimulation() {
  const clients = getClients(EL.numberOfSpeakers.value);
  const simulation = new Simulator(clients, 5000);
  simulation.init();
}

function getClients(numClients) {
  const clients = [];

  for (let i = 0; i < numClients; i += 1) {
    // select target language at random
    const targetLang = LANGUAGECODES[Math.floor(Math.random() * LANGUAGECODES.length)].code;

    // translate rate is 1000ms +/- 500ms (randomized)
    const translateRate = 1000 + Math.floor(((Math.random() - 0.5) * 500));
    const newClient = new Client([...TEXTLIST], getWsAddr(), targetLang, translateRate);
    clients.push(newClient);
  }

  return clients;
}

function initLanguageSelector() {
  for (const language of LANGUAGECODES) {
    const optionEl = document.createElement('option');
    optionEl.value = language.code;
    optionEl.textContent = `${language.name} [${language.code}]`;
    EL.languageSelector.appendChild(optionEl);
  }
}

function getWsAddr() {
  return 'ws://' + EL.translateServerAddr.value;
}

function initElements() {
  EL.textToTranslate = document.querySelector('#text-to-translate');
  EL.translatedText = document.querySelector('#translated-text');
  EL.languageSelector = document.querySelector('#language-selector');
  EL.translateServerAddr = document.querySelector('#translate-server-address');
  EL.serverAddressUpdate = document.querySelector('#server-address-update');
  EL.numberOfSpeakers = document.querySelector('#number-of-speakers');
  EL.startSimulation = document.querySelector('#start-simulation');
}

function addEventListeners() {
  EL.textToTranslate.addEventListener('keyup', () => {
    MANUALTRANSLATOR.requestTranslation();
  });

  EL.languageSelector.addEventListener('change', () => {
    MANUALTRANSLATOR.requestTranslation();
  });

  EL.serverAddressUpdate.addEventListener('click', () => {
    MANUALTRANSLATOR.updateWebSocket(getWsAddr());
  });

  EL.startSimulation.addEventListener('click', runSimulation);
}

function init() {
  initElements();
  initLanguageSelector();
  EL.translateServerAddr.value = window.location.hostname + ':' + window.location.port;
  MANUALTRANSLATOR = new ManualTranslator(
    EL.textToTranslate,
    EL.translatedText,
    EL.languageSelector,
    getWsAddr(),
  );
  addEventListeners();
}

window.addEventListener('load', init);
