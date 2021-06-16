import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { Elements } from './classes/elements.js';
import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

function runSimulation(elements) {
  const clients = getClients(elements.numberOfSpeakers.value);
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
    const newClient = new Client([...textList], getWsAddr(new Elements()), targetLang, translateRate);
    clients.push(newClient);
  }

  return clients;
}

function initLanguageSelector(elements) {
  for (const language of languageCodes) {
    const optionEl = document.createElement('option');
    optionEl.value = language.code;
    optionEl.textContent = `${language.name} [${language.code}]`;
    elements.languageSelector.appendChild(optionEl);
  }
}

function getWsAddr(elements) {
  return 'ws://' + elements.translateServerAddr.value;
}

function addEventListeners(elements) {
  const manualTranslator = new ManualTranslator(
    elements.textToTranslate,
    elements.translatedText,
    elements.languageSelector,
    getWsAddr(elements),
  );

  elements.textToTranslate.addEventListener('keyup', () => {
    manualTranslator.requestTranslation();
  });

  elements.languageSelector.addEventListener('change', () => {
    manualTranslator.requestTranslation();
  });

  elements.serverAddressUpdate.addEventListener('click', () => {
    manualTranslator.updateWebSocket(getWsAddr());
  });

  elements.startSimulation.addEventListener('click', () => {
    runSimulation(elements);
  });
}

function init() {
  const elements = new Elements();
  initLanguageSelector(elements);
  elements.translateServerAddr.value = window.location.hostname + ':' + window.location.port;
  addEventListeners(elements);
}

window.addEventListener('load', init);
