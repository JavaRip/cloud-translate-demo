import { ManualTranslator } from './classes/manualTranslator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { Logger } from './classes/logger.js';
import { Demo } from './classes/demo.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

const elements = new Elements();
const navigator = new Navi();
const logger = new Logger();
const demo = new Demo(textList, 500);
const manualTranslator = new ManualTranslator(
  elements.textToTranslate,
  elements.translatedText,
  elements.manualLanguageSelector,
);

function updateWsAddrPreview() {
  // config
  const protocol = elements.translateServerProtocol.value;
  const hostname = elements.translateServerAddr.value;
  const port = elements.translateServerPort.value;
  const wsAddress = (port === '') ? `${protocol}://${hostname}` : `${protocol}://${hostname}:${port}`;

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

  elements.manualLanguageSelector.addEventListener('change', () => {
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
}

function initLanguageSelectors(languageSelector) {
  // init language selector
  for (const language of languageCodes) {
    const optionEl = document.createElement('option');
    optionEl.value = language.code;
    optionEl.textContent = `${language.name} [${language.code}]`;
    languageSelector.appendChild(optionEl);
  }
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

function init() {
  elements.languageSelectors.forEach(element => initLanguageSelectors(element));
  logger.init(elements.logs, elements.simulationLog, elements.clientLog, elements.translationLog);
  setTranslateServer();
  manualTranslator.init(getWsAddr());
  addEventListeners();
}

window.addEventListener('load', init);
