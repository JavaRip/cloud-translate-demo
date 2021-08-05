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

function getWsAddr() {
  return elements.translateServerAddr.value;
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

async function getTranslatorPort() {
  const res = await fetch('/translatorPort');
  return await res.json();
}

async function init() {
  const translatorPort = await getTranslatorPort();
  loadLogs();
  elements.translateServerAddr.value = `ws://${window.location.hostname}:${translatorPort}`;
  manualTranslator.init(languageCodes, elements.languageSelector, getWsAddr());
  addEventListeners();
}

window.addEventListener('load', init);
