export class Demo {
  constructor(textList, translationsEl, languageSelector, startButton) {
    this.interval = null;
    this.ws = null;
    this.sourceText = textList;
    this.translationsEl = translationsEl;
    this.languageSelector = languageSelector;
    this.startButton = startButton;
    this.self = this;
  }

  init(websocketAddr) {
    this.ws = new WebSocket(websocketAddr);
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event); });

    for (const text of this.sourceText) {
      // create template in html instead of creating divs in javascript
      const sourceTextDiv = document.createElement('div');
      const translationPlaceholder = document.createElement('div');
      const translationIndicator = document.createElement('div');

      sourceTextDiv.classList.add('source-item');
      sourceTextDiv.classList.add('awaiting-translation');
      sourceTextDiv.textContent = text;

      translationPlaceholder.classList.add('translation');

      translationIndicator.classList.add('translation-indicator');

      this.translationsEl.appendChild(sourceTextDiv);
      this.translationsEl.appendChild(translationIndicator);
      this.translationsEl.appendChild(translationPlaceholder);
    }

    this.startButton.addEventListener('click', () => { this.start(this.self); });
  }

  start(self) {
    self.interval = window.setInterval(self.requestTranslation, 1500, self);
  }

  requestTranslation(self) {
    const requestEl = self.translationsEl.querySelector('.awaiting-translation');

    if (!requestEl) {
      window.clearInterval(self.interval);
      self.ws.close();
      return;
    }

    requestEl.classList.remove('awaiting-translation');
    requestEl.classList.add('pending-translation');

    const request = JSON.stringify({
      requestSent: Date.now(),
      text: requestEl.textContent,
      target: self.languageSelector.value,
    });

    requestEl.dataset.requestJson = request;
    self.ws.send(request);
  }

  receiveTranslation(event) {
    const translation = JSON.parse(event.data);
    const originalRequestEl = this.getOriginalRequestEl(translation);

    originalRequestEl.classList.remove('pending-translation');
    originalRequestEl.classList.add('translation-received');

    const translationEl = originalRequestEl.nextElementSibling.nextElementSibling;
    translationEl.textContent = translation.translation;
  }

  getOriginalRequestEl(translation) {
    for (const item of this.translationsEl.querySelectorAll('.source-item')) {
      if (item.dataset.requestJson === JSON.stringify(translation.request)) {
        return item;
      }
    }

    return false;
  }
}
