import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { StatDisplayer } from './classes/statDisplayer.js';
import { Logger } from './classes/logger.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

let runningSimulation = false; // can be false or a simulation
const elements = new Elements();
const navigator = new Navi();
const statDisplayer = new StatDisplayer(elements);
const logger = new Logger();
const manualTranslator = new ManualTranslator(
  elements.textToTranslate,
  elements.translatedText,
  elements.languageSelector,
);

function runAllLangaugesTest() {
  const clients = getLanguageClients(languageCodes);
  const duration = (Number(elements.allLangaugesTestDuration.value) * 1000);
  const simulation = new Simulator(clients, duration);
  setSimulationButtons(simulation);
  statDisplayer.displayStats(simulation);
}

function runStressTest() {
  const clients = getRandomClients(elements.numberOfClients.value);
  const duration = (Number(elements.stressTestDuration.value) * 1000);
  const simulation = new Simulator(clients, duration);
  setSimulationButtons(simulation);
  statDisplayer.displayStats(simulation);
}

function getLanguageClients(languageCodes) {
  const clients = [];

  for (const language of languageCodes) {
    // select target language at random
    const targetLang = language.code;

    // translate rate is 1000ms +/- 500ms (randomized)
    const translateRate = 1000;
    const newClient = new Client([...textList], getWsAddr(), targetLang, translateRate);
    clients.push(newClient);
  }

  return clients;
}

function getRandomClients(numClients) {
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

function setSimulationButtons() {
  for (const button of elements.stopButtons) {
    button.addEventListener('click', stopSimulation);
    button.style.display = '';
  }

  for (const button of elements.startButtons) {
    button.style.display = 'none';
  }
}

function stopSimulation() {
  runningSimulation.stop();
  statDisplayer.stopRefreshing();
  resetSimulationButtons();
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

function updateWsAddrPreview() {
  const protocol = elements.translateServerProtocol.value;
  const hostname = elements.translateServerAddr.value;
  const port = elements.translateServerPort.value;
  const wsAddress =
    (port === '') ? `${protocol}://${hostname}` : `${protocol}://${hostname}:${port}`;

  elements.translateServerPreview.textContent = wsAddress;
}

function getWsAddr() {
  return elements.translateServerCurrent.textContent;
}

function addEventListeners() {
  elements.textToTranslate.addEventListener('keyup', () => {
    manualTranslator.requestTranslation();
  });

  elements.languageSelector.addEventListener('change', () => {
    manualTranslator.requestTranslation();
  });

  elements.serverAddressUpdate.addEventListener('click', () => {
    elements.translateServerCurrent.textContent = elements.translateServerPreview.textContent;
    manualTranslator.updateWebSocket(getWsAddr());
  });

  for (const element of elements.configParams.querySelectorAll('input')) {
    element.addEventListener('change', updateWsAddrPreview);
  }

  elements.startStressTest.addEventListener('click', () => {
    runStressTest();
  });

  elements.startAllLanguagesTest.addEventListener('click', () => {
    runAllLangaugesTest();
  });

  elements.nav.addEventListener('click', (event) => {
    navigator.parse(event, elements);
  });

  window.addEventListener('simulationStarted', (event) => {
    runningSimulation = event.detail;
  });

  window.addEventListener('simulationStopped', (event) => {
    runningSimulation = false;
    resetSimulationButtons();
    logger.saveLogs(event.detail);
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

function setTranslateServer() {
  const protocol = 'ws';
  const hostname = window.location.hostname;
  const port = '9999';
  const wsAddress = `${protocol}://${hostname}:${port}`;

  elements.translateServerProtocol.value = protocol;
  elements.translateServerAddr.value = `${window.location.hostname}`;
  elements.translateServerPort.value = '9999';
  elements.translateServerPreview.textContent = wsAddress;
  elements.translateServerCurrent.textContent = wsAddress;
}

async function loadLogs() {
  const logs = await logger.getLogs();
  logger.displayLogs(
    logs,
    elements.logs,
    elements.simulationLog,
    elements.clientLog,
    elements.translationLog,
  );
}

function init() {
  loadLogs();
  setTranslateServer();
  manualTranslator.init(languageCodes, elements.languageSelector, getWsAddr());
  addEventListeners();
}

window.addEventListener('load', init);
