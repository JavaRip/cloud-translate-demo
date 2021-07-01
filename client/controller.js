import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { StatDisplayer } from './classes/statDisplayer.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

const elements = new Elements();
const navigator = new Navi();
const statDisplayer = new StatDisplayer(elements);
const manualTranslator = new ManualTranslator(
  elements.textToTranslate,
  elements.translatedText,
  elements.languageSelector,
  'ws://' + window.location.hostname + ':' + window.location.port,
);

function runSimulation() {
  const clients = getClients(elements.numberOfClients.value);
  const duration = (Number(elements.simulationDuration.value) * 1000);
  const simulation = new Simulator(clients, duration);
  setSimulationButtons(simulation);
  statDisplayer.displayStats(simulation);
}

function setSimulationButtons(simulation) {
  for (const button of elements.stopButtons) {
    button.addEventListener('click', () => {
      simulation.stop();
      statDisplayer.stopRefreshing();
      resetSimulationButtons();
    });
    button.style.display = '';
  }

  for (const button of elements.startButtons) {
    button.style.display = 'none';
  }
}

function resetSimulationButtons() {
  // when simulation has stopped hide stop buttons show start buttons
  for (const button of elements.stopButtons) {
    button.style.display = 'none';
  }

  for (const button of elements.startButtons) {
    button.style.display = '';
  }
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

function getWsAddr() {
  return 'ws://' + elements.translateServerAddr.value;
}

function addEventListeners() {
  elements.textToTranslate.addEventListener('keyup', () => {
    manualTranslator.requestTranslation();
  });

  elements.languageSelector.addEventListener('change', () => {
    manualTranslator.requestTranslation();
  });

  elements.serverAddressUpdate.addEventListener('click', () => {
    manualTranslator.updateWebSocket(getWsAddr());
  });

  elements.startStressTest.addEventListener('click', () => {
    runSimulation();
  });

  elements.nav.addEventListener('click', (event) => {
    navigator.parse(event, elements);
  });

  window.addEventListener('simulationStarted', (event) => {
    setSimulationButtons(event.detail);
  });

  window.addEventListener('simulationStopped', () => {
    resetSimulationButtons();
  });

  for (const button of elements.plusButtons) {
    button.addEventListener('click', () => {
      const input = button.parentNode.querySelector('input');
      input.value = Number(input.value) + 1;
    });
  }

  for (const button of elements.minusButtons) {
    button.addEventListener('click', () => {
      const input = button.parentNode.querySelector('input');
      if (Number(input.value) > 0) input.value = Number(input.value) - 1;
      else input.value = 0;
    });
  }
}

function init() {
  manualTranslator.initLanguageSelector(languageCodes, elements.languageSelector);
  elements.translateServerAddr.value = window.location.hostname + ':' + window.location.port;
  addEventListeners();
}

window.addEventListener('load', init);
