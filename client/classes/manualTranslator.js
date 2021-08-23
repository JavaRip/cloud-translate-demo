export class ManualTranslator {
  constructor(textSource, textDestination, targetSelector) {
    this.textSource = textSource;
    this.textDestination = textDestination;
    this.targetSelector = targetSelector;
  }

  init(webSocketAddress) {
    // init event listeners
    this.textSource.addEventListener('keyup', () => {
      this.requestTranslation(this);
    });

    this.targetSelector.addEventListener('change', () => {
      this.requestTranslation(this);
    });

    // init websocket address
    this.updateWebSocket(webSocketAddress);
  }

  updateWebSocket(webSocketAddress, self = this) {
    try {
      if (self.ws) self.ws.close();
      self.ws = new WebSocket(webSocketAddress);

      self.ws.addEventListener('message', (event) => {
        self.receiveTranslation(event, self);
      });

      self.ws.addEventListener('open', () => {
        console.log(`MT WS open at: ${self.ws.url}`);
      });
    } catch {
      console.error(`invalid websocket address ${webSocketAddress}`);
    }
  }

  requestTranslation(self) {
    self.ws.send(JSON.stringify({
      text: self.textSource.value,
      target: self.targetSelector.value,
    }));
  }

  receiveTranslation(event, self) {
    self.textDestination.textContent = JSON.parse(event.data).translation;
  }
}
