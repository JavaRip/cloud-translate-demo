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

  stop() {
    this.ws.close();
    window.clearInterval(this.intervalId);
  }

  openWebsocket() {
    this.intervalId = setInterval(this.boundRequestTranslation, this.intervalTime);
  }

  requestTranslation() {
    this.ws.send(JSON.stringify({
      text: this.textArray[0],
      target: this.targetLanguage,
    }));

    // rotate text array so next message is sent next
    const buffer = this.textArray.pop();
    this.textArray.unshift(buffer);
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
