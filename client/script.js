const EL = {};
let MANUALTRANSLATOR = null;
// let SIMULATOR = null;
import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
// import { Simulator } from './classes/simulator.js';
import { languages as LANGUAGECODES } from './data/languageCodes.js';
import { textList as TEXTLIST } from './data/sampleTexts.js';

function runSimulation() {
  const clients = [];
  const numberOfClients = EL.numberOfSpeakers.value;
  const translatorWs = getWsAddr;

  for (let i = 0; i < numberOfClients; i += 1) {
    const targetLang = LANGUAGECODES[Math.floor(Math.random() * LANGUAGECODES.length)].code;
    const translateRate = 1000 + Math.floor(((Math.random() - 0.5) * 500));
    const newClient = new Client([...TEXTLIST], translatorWs, targetLang, translateRate);
    newClient.init();
    clients.push(newClient);
  }
}

function initLanguageSelector() {
  for (const language of LANGUAGECODES) {
    const optionEl = document.createElement('option');
    optionEl.value = language.code;
    optionEl.textContent = language.name;
    EL.languageSelector.appendChild(optionEl);
  }
}

function getWsAddr() {
  return 'ws://' + EL.translateServerAddress.value;
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
  EL.textToTranslate.addEventListener('keyup', () => {
    MANUALTRANSLATOR.requestTranslation()
  });

  EL.languageSelector.addEventListener('change', () => {
    MANUALTRANSLATOR.requestTranslation()
  });

  EL.serverAddressUpdate.addEventListener('click', () => {
    MANUALTRANSLATOR.updateWebSocket(getWsAddr());
  });

  EL.startSimulation.addEventListener('click', runSimulation);
}

function init() {
  initElements();
  initLanguageSelector();
  EL.translateServerAddress.value = window.location.hostname + ':' + (window.location.port || '80');
  MANUALTRANSLATOR = new ManualTranslator(EL.textToTranslate, EL.translatedText, EL.languageSelector, getWsAddr());
  addEventListeners();
}

window.addEventListener('load', init)


