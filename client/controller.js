import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { Logger } from './classes/logger.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

let runningSimulation = false; // can be false or a simulation
const elements = new Elements();
const navigator = new Navi();
const logger = new Logger();
const manualTranslator = new ManualTranslator(
  elements.textToTranslate,
  elements.translatedText,
  elements.languageSelector,
);

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
  // config
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
  // manual translator
  elements.textToTranslate.addEventListener('keyup', () => {
    manualTranslator.requestTranslation();
  });

  elements.languageSelector.addEventListener('change', () => {
    manualTranslator.requestTranslation();
  });

  // config
  elements.serverAddressUpdate.addEventListener('click', () => {
    elements.translateServerCurrent.textContent = elements.translateServerPreview.textContent;
    manualTranslator.updateWebSocket(getWsAddr());
  });

  for (const element of elements.configParams.querySelectorAll('input')) {
    element.addEventListener('change', updateWsAddrPreview);
  }

  // nav
  elements.nav.addEventListener('click', (event) => {
    navigator.parse(event, elements);
  });


  // simulation
  window.addEventListener('simulationStarted', (event) => {
    runningSimulation = event.detail;
  });

  window.addEventListener('simulationStopped', (event) => {
    runningSimulation = false;
    resetSimulationButtons();
    logger.saveLogs(event.detail);
  });
}

function setTranslateServer() {
  // config
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
