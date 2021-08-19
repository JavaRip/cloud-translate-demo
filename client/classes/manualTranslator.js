export class ManualTranslator {
  constructor(textSource, textDestination, targetSelector) {
    this.textSource = textSource;
    this.textDestination = textDestination;
    this.targetSelector = targetSelector;
  }

  init(webSocketAddress) {
    // init event listeners
    this.textSource.addEventListener('keyup', () => {
      this.requestTranslation();
    });

    this.targetSelector.addEventListener('change', () => {
      this.requestTranslation();
    });

    // init websocket address
    this.updateWebSocket(webSocketAddress);
  }

  updateWebSocket(webSocketAddress) {
    try {
      this.ws = new WebSocket(webSocketAddress);
      this.ws.addEventListener('message', (event) => { this.receiveTranslation(event); });
    } catch {
      console.error(`invalid websocket address ${webSocketAddress}`);
    }
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
