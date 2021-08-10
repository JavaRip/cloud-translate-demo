export class ManualTranslator {
  constructor(textSource, textDestination, targetSelector) {
    this.textSource = textSource;
    this.textDestination = textDestination;
    this.targetSelector = targetSelector;
  }

  init(webSocketAddress) {
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
