export class ManualTranslator {
  constructor(textSource, textDestination, targetSelector, webSocketAddr) {
    this.textSource = textSource;
    this.textDestination = textDestination;
    this.targetSelector = targetSelector;
    this.ws = new WebSocket(webSocketAddr);
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event) });
  }

  updateWebSocket(websocketAddr) {
    this.ws = new WebSocket(websocketAddr);
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event) });
  }

  requestTranslation() {
    this.ws.send(JSON.stringify({
      text: this.textSource.value,
      target: this.targetSelector.value,
    }));
  }

  receiveTranslation(event) {
    this.textDestination.textContent = event.data;
  }
}
