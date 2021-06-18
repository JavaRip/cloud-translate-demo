export class Elements {
  constructor() {
    this.wrapper = document.querySelector('#wrapper');
    this.textToTranslate = document.querySelector('#text-to-translate');
    this.translatedText = document.querySelector('#translated-text');
    this.languageSelector = document.querySelector('#language-selector');
    this.translateServerAddr = document.querySelector('#translate-server-address');
    this.serverAddressUpdate = document.querySelector('#server-address-update');
    this.numberOfSpeakers = document.querySelector('#number-of-speakers');
    this.startSimulation = document.querySelector('#start-simulation');
    this.stopSimulation = document.querySelector('#stop-simulation');
    this.simulationDuration = document.querySelector('#simulation-duration');
    this.translationsRequested = document.querySelector('#translations-requested');
    this.translationsReceived = document.querySelector('#translations-received');
    this.responseTime = document.querySelector('#response-time');
    this.nav = document.querySelector('nav');
  }
}
