export class ManualTranslator {
  constructor(textSource, textDestination, targetSelector) {
    this.textSource = textSource;
    this.textDestination = textDestination;
    this.targetSelector = targetSelector;
  }

  init(languageCodes, languageSelector, webSocketAddress) {
    // init language selector
    for (const language of languageCodes) {
      const optionEl = document.createElement('option');
      optionEl.value = language.code;
      optionEl.textContent = `${language.name} [${language.code}]`;
      languageSelector.appendChild(optionEl);
    }

    // init websocket address
    this.ws = new WebSocket(webSocketAddress);
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event); });
  }

  updateWebSocket(webSocketAddress) {
    this.ws = new WebSocket(webSocketAddress);
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event); });
  }

  requestTranslation() {
    this.ws.send(JSON.stringify({
      text: this.textSource.value,
      target: this.targetSelector.value,
    }));
  }

  receiveTranslation(event) {
    this.textDestination.textContent = JSON.parse(event.data).translation;
  }
}
