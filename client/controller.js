import { Config } from './classes/config.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { Demo } from './classes/demo.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

const els = new Elements();
const config = new Config(els);
new Navi(els).init(els);
const demo = new Demo(textList, els);

const manualTranslator = new ManualTranslator(
  els.textToTranslate,
  els.manualTranslatedText,
  els.manualLanguageSelector,
);

function init() {
  config.init(languageCodes, manualTranslator, demo);
  manualTranslator.init(config.getWsAddr());
  demo.init(config.getWsAddr());
}

window.addEventListener('load', init);
