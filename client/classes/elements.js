export class Elements {
  constructor() {
    this.textToTranslate = document.querySelector('#text-to-translate');
    this.translatedText = document.querySelector('#translated-text');
    this.languageSelector = document.querySelector('#language-selector');
    this.translateServerAddr = document.querySelector('#translate-server-address');
    this.serverAddressUpdate = document.querySelector('#server-address-update');
    this.numberOfSpeakers = document.querySelector('#number-of-speakers');
    this.startSimulation = document.querySelector('#start-simulation');
    this.simulationDuration = document.querySelector('#simulation-duration');
  }
}
