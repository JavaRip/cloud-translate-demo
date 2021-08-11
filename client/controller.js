import { Config } from './classes/config.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
// import { Logger } from './classes/logger.js';
import { Demo } from './classes/demo.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

const els = new Elements();
const config = new Config(els);
new Navi(els).init(els);
// const logger = new Logger(
//   els.logs,
//   els.simulationLog,
//   els.clientLog,
//   els.translationLog,
// );

const demo = new Demo(
  textList,
  els.demoTranslations,
  els.demoLanguageSelector,
  els.startDemo,
);

const manualTranslator = new ManualTranslator(
  els.textToTranslate,
  els.translatedText,
  els.manualLanguageSelector,
);

function init() {
  config.init(languageCodes, manualTranslator);
  manualTranslator.init(config.getWsAddr());
  demo.init(config.getWsAddr());
}

window.addEventListener('load', init);
