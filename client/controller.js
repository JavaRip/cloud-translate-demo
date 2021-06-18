import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';
const elements = new Elements();
let statRefreshId; // this and its associated code should be in their own class

function runSimulation() {
  const clients = getClients(elements.numberOfSpeakers.value);
  const duration = (Number(elements.simulationDuration.value) * 1000);
  const simulation = new Simulator(clients, duration);
  setSimulationButtons(simulation);
  simulation.init();
  displaySimulationStats(simulation);
}

function setSimulationButtons(simulation) {
  elements.stopSimulation.addEventListener('click', () => {
    simulation.stop();
    window.clearInterval(statRefreshId);
  });
  elements.stopSimulation.style.display = '';
  elements.startSimulation.style.display = 'none';
}

function resetSimulationButtons() {
  elements.stopSimulation.style.display = 'none';
  elements.startSimulation.style.display = '';
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

function displaySimulationStats(simulation) {
  statRefreshId = setInterval(() => {
    simulation.getStats();
    elements.translationsReceived.textContent = simulation.translationsReceived;
    elements.translationsRequested.textContent = simulation.translationsRequested;
    elements.responseTime.textContent = simulation.averageResponseTime + 'ms';
  }, 500);

  setTimeout(() => {
    window.clearInterval(statRefreshId);
    resetSimulationButtons();
  }, simulation.runTime + 1000);
}

function initLanguageSelector() {
  for (const language of languageCodes) {
    const optionEl = document.createElement('option');
    optionEl.value = language.code;
    optionEl.textContent = `${language.name} [${language.code}]`;
    elements.languageSelector.appendChild(optionEl);
  }
}

function getWsAddr() {
  return 'ws://' + elements.translateServerAddr.value;
}

function addEventListeners() {
  const manualTranslator = new ManualTranslator(
    elements.textToTranslate,
    elements.translatedText,
    elements.languageSelector,
    getWsAddr(),
  );
  const navigator = new Navi();

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
    runSimulation();
  });

  elements.nav.addEventListener('click', (event) => {
    navigator.parse(event, elements);
  });
}

function init() {
  initLanguageSelector();
  elements.translateServerAddr.value = window.location.hostname + ':' + window.location.port;
  addEventListeners();
}

window.addEventListener('load', init);
