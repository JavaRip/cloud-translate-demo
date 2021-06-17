export class ManualTranslator {
  constructor(textSource, textDestination, targetSelector, webSocketAddress) {
    this.textSource = textSource;
    this.textDestination = textDestination;
    this.targetSelector = targetSelector;
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
