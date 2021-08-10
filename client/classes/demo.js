export class Demo {
  constructor(textArray, textRate) {
    this.textArray = textArray; // lines of text to send to translator
    this.translationsRequested = [];
    this.translationsReceived = [];
    this.intervalId = null;
    this.intervalTime = textRate;
    this.boundRequestTranslation = null; // required for setInterval https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval#the_this_problem
  }

  init(translatorWebsocket, targetLanguage) {
    this.translatorWebsocket = translatorWebsocket;
    this.targetLanguage = targetLanguage;
    this.ws = new WebSocket(this.translatorWebsocket);
    this.ws.addEventListener('open', () => { this.openWebsocket(); });
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event); });
    this.boundRequestTranslation = this.requestTranslation.bind(this);
  }

  stop() {
    // stop requesting translations
    window.clearInterval(this.intervalId);

    // close websocket 1 second after requests have stopped to wait for responses
    setTimeout(this.ws.close(), 1000);
  }

  openWebsocket() {
    this.intervalId = setInterval(this.boundRequestTranslation, this.intervalTime);
  }

  requestTranslation() {
    const translationRequest = {
      text: this.textArray[0],
      target: this.targetLanguage,
      reqTimeStamp: String(Date.now()),
    };

    this.ws.send(JSON.stringify(translationRequest));
    this.translationsRequested.push(translationRequest);

    // rotate text array so next message is sent next
    const buffer = this.textArray.pop();
    this.textArray.unshift(buffer);
  }

  receiveTranslation(event) {
    const res = JSON.parse(event.data);
    res.resTime = Number(Date.now()) - new Date(Number(res.request.reqTimeStamp));
    this.translationsReceived.push(res);
  }
}
