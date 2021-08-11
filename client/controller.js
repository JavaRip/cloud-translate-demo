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
new Navi(elements).init(elements);
const logger = new Logger();
const demo = new Demo(textList, 500, elements.sourceText, elements.demoTranslatedText);
const manualTranslator = new ManualTranslator(
  elements.textToTranslate,
  elements.translatedText,
  elements.manualLanguageSelector,
);

for (const text of textList) {
  const div = document.createElement('div');
  div.textContent = text;
  elements.sourceText.appendChild(div);
}

function init() {
  logger.init(elements.logs, elements.simulationLog, elements.clientLog, elements.translationLog);
  config.init(languageCodes, elements, manualTranslator);
  manualTranslator.init(config.getWsAddr());
}

window.addEventListener('load', init);
