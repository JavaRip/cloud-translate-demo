import { Config } from './classes/config.js';
import { ManualTranslator } from './classes/manualTranslator.js';
import { Elements } from './classes/elements.js';
import { Navi } from './classes/navigator.js';
import { Logger } from './classes/logger.js';
// import { Demo } from './classes/demo.js';

import { languages as languageCodes } from './data/languageCodes.js';
import { textList } from './data/sampleTexts.js';

const els = new Elements();
const config = new Config(els);
new Navi(els).init(els);
const logger = new Logger();
// const demo = new Demo();
const manualTranslator = new ManualTranslator(
  els.textToTranslate,
  els.translatedText,
  els.manualLanguageSelector,
);

let demoInterval = null;
function demoCode() {
  const demoWs = new WebSocket(config.getWsAddr());
  demoWs.addEventListener('message', (event) => { receiveTranslation(event); });

  function requestTranslation() {
    const requestEl = els.sourceText.querySelector('.awaiting-translation');

    if (!requestEl) {
      window.clearInterval(demoInterval);
      return;
    }

    requestEl.classList.remove('awaiting-translation');
    requestEl.classList.add('pending-translation');

    const request = JSON.stringify({
      requestSent: Date.now(),
      text: requestEl.textContent,
      target: els.demoLanguageSelector.value,
    });

    requestEl.dataset.requestJson = request;
    demoWs.send(request);
  }

  function receiveTranslation(event) {
    const translation = JSON.parse(event.data);
    const originalRequestEl = getOriginalRequestEl(translation);
    originalRequestEl.classList.remove('pending-translation');
    originalRequestEl.classList.add('translation-received');
  }

  function getOriginalRequestEl(translation) {
    for (const item of els.sourceText.querySelectorAll('.source-item')) {
      console.log(item.dataset.requestJson);
      if (item.dataset.requestJson === JSON.stringify(translation.request)) {
        return item;
      }
    }

    return 'request not found';
  }

  for (const text of textList) {
    // put text into source text div
    const div = document.createElement('div');
    div.classList.add('source-item');
    div.classList.add('awaiting-translation');
    div.textContent = text;
    els.sourceText.appendChild(div);
  }
  // send translations (one every 500ms or so)
  demoInterval = window.setInterval(requestTranslation, 1500);

  // receive translations, match to request and put in translations div
}

function init() {
  logger.init(els.logs, els.simulationLog, els.clientLog, els.translationLog);
  config.init(languageCodes, els, manualTranslator);
  manualTranslator.init(config.getWsAddr());

  // put this into own class before
  demoCode();
}

window.addEventListener('load', init);
