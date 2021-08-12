export class Demo {
  constructor(textList, elements) {
    this.interval = null;
    this.ws = null;
    this.sourceText = textList;
    this.translationsEl = elements.demoTranslations;
    this.languageSelector = elements.demoLanguageSelector;
    this.translationTemplate = elements.demoTranslation;
    this.startButton = elements.startDemo;
    this.stopButton = elements.stopDemo;
    this.resetButton = elements.resetDemo;

    // self used for async functions where 'this' will have changed
    this.self = this;
  }

  init(websocketAddr) {
    this.ws = new WebSocket(websocketAddr);
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event); });

    for (const text of this.sourceText) {
      // create template in html instead of creating divs in javascript
      const translationTemplate = document.importNode(this.translationTemplate.content, true);

      const sourceTextDiv = translationTemplate.querySelector('.source-item');
      const translationIndicator = translationTemplate.querySelector('.translation-indicator');
      const translationPlaceholder = translationTemplate.querySelector('.translation');

      sourceTextDiv.textContent = text;

      this.translationsEl.appendChild(sourceTextDiv);
      this.translationsEl.appendChild(translationIndicator);
      this.translationsEl.appendChild(translationPlaceholder);
    }

    this.startButton.addEventListener('click', () => { this.start(this.self); });
    this.stopButton.addEventListener('click', () => { this.stop(this.self); });
    this.resetButton.addEventListener('click', () => { this.reset(this.self); });
  }

  start(self) {
    this.startButton.style.display = 'none';
    this.stopButton.style.display = '';
    self.interval = window.setInterval(self.requestTranslation, 1500, self);
  }

  stop(self) {
    window.clearInterval(self.interval);
    self.ws.close();
    self.resetCurrentTranslation(self);
    self.stopButton.style.display = 'none';
    self.resetButton.style.display = '';

    for (const el of self.translationsEl.querySelectorAll('.awaiting-translation')) {
      el.classList.remove('awaiting-translation');
      el.classList.add('pending-translation');
    }
  }

  reset(self) {
    self.resetCurrentTranslation(self);
    self.resetButton.style.display = 'none';
    self.startButton.style.display = '';

    for (const el of self.translationsEl.querySelectorAll('.source-item')) {
      el.classList.add('awaiting-translation');
      el.classList.remove('pending-translation');
      el.classList.remove('translation-received');
    }

    for (const el of self.translationsEl.querySelectorAll('.translation')) {
      el.textContent = '';
    }
  }

  requestTranslation(self) {
    const requestEl = self.translationsEl.querySelector('.awaiting-translation');

    if (!requestEl) {
      self.stop(self);
      return;
    }

    requestEl.classList.remove('awaiting-translation');
    requestEl.classList.add('pending-translation');

    // update highlighting of current translation
    self.resetCurrentTranslation(self);
    requestEl.classList.add('current-translation');

    const request = JSON.stringify({
      requestSent: Date.now(),
      text: requestEl.textContent,
      target: self.languageSelector.value,
    });

    requestEl.dataset.requestJson = request;
    self.ws.send(request);
  }

  resetCurrentTranslation(self) {
    self.translationsEl.querySelectorAll('.source-item').forEach(element =>
      element.classList.remove('current-translation'),
    );
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
