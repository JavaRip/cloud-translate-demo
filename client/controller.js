import { Client } from './classes/client.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Simulator } from './classes/simulator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { Pie } from './classes/pie.js';
import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';
const elements = new Elements();
const pie = new Pie(elements.translationsPie);
let statRefreshId; // this and its associated code should be in their own class

function runSimulation() {
  const clients = getClients(elements.numberOfClients.value);
  const duration = (Number(elements.simulationDuration.value) * 1000);
  const simulation = new Simulator(clients, duration);
  setSimulationButtons(simulation);
  simulation.init();
  displaySimulationStats(simulation);
}

function setSimulationButtons(simulation) {
  for (const button of elements.stopButtons) {
    button.addEventListener('click', () => {
      simulation.stop();
      window.clearInterval(statRefreshId);
      resetSimulationButtons();
    });
    button.style.display = '';
  }

  for (const button of elements.startButtons) {
    button.style.display = 'none';
  }
}

function resetSimulationButtons() {
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

function displaySimulationStats(simulation) {
  statRefreshId = setInterval(() => {
    simulation.getStats();
    elements.translationsReceived.textContent = simulation.translationsReceived;
    elements.translationsRequested.textContent = simulation.translationsRequested;
    elements.responseTime.textContent = simulation.averageResponseTime + 'ms';

    const succTranslations = simulation.translationsRequested + simulation.translationsReceived;
    const failedTranslations = simulation.translationsRequested - simulation.translationsReceived;
    pie.draw([
      { label: 'Successful Translations', value: succTranslations },
      { label: 'Failed Translations', value: failedTranslations },
    ]);
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

  elements.startStressTest.addEventListener('click', () => {
    runSimulation();
  });

  elements.nav.addEventListener('click', (event) => {
    navigator.parse(event, elements);
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
  initLanguageSelector();
  elements.translateServerAddr.value = window.location.hostname + ':' + window.location.port;
  addEventListeners();
}

window.addEventListener('load', init);
