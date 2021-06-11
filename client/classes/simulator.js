export class Client {
  constructor(textArray, translatorWebsocket, targetLanguage, textRate) {
    this.textArray = textArray ; // lines of text to send to translator
    this.translatorWebsocket = translatorWebsocket;
    this.targetLanguage = targetLanguage;
    this.translations = [];
    this.intervalId = null;
    this.intervalTime = textRate;
    this.boundRequestTranslation = null; // required for setInterval https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval#the_this_problem
  }

  init() {
    this.ws = new WebSocket(this.translatorWebsocket);
    this.ws.addEventListener('open', () => { this.openWebsocket() });
    this.ws.addEventListener('message', (event) => { this.receiveTranslation(event) });
    this.boundRequestTranslation = this.requestTranslation.bind(this);
  }

  openWebsocket() {
    this.intervalId = setInterval(this.boundRequestTranslation, this.intervalTime);
  }

  requestTranslation() {
    if (this.textArray.length > 0) {
      this.ws.send(JSON.stringify({
        text: this.textArray.pop(),
        target: this.targetLanguage,
      }));
    } else {
      window.clearInterval(this.intervalId);
      this.ws.close();
    }
  }

  receiveTranslation(event) {
    this.translations.push(event.data);
    console.log(`speakerId: ${this.intervalId},`);
    console.log(`speakerRate: ${this.intervalTime},`);
    console.log(`targetLanguage: ${this.targetLanguage}`);
    console.log(`translation: ${event.data}`);
    console.log('//////');
  }
}
