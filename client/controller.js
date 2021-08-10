import { Config } from './classes/config.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { Logger } from './classes/logger.js';
import { Demo } from './classes/demo.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

const elements = new Elements();
const config = new Config(elements);
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
    manualTranslator.updateWebSocket(config.getWsAddr());
  });

  for (const element of elements.configParams.querySelectorAll('input')) {
    element.addEventListener('change', updateWsAddrPreview);
  }

  // nav
  elements.nav.addEventListener('click', (event) => {
    navigator.parse(event, elements);
  });
}

function init() {
  logger.init(elements.logs, elements.simulationLog, elements.clientLog, elements.translationLog);
  config.setTranslateServer();
  config.initLanguageSelectors(elements.languageSelectors, languageCodes);
  manualTranslator.init(config.getWsAddr());
  addEventListeners();
}

window.addEventListener('load', init);
