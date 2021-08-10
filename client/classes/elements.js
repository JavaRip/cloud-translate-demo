export class Elements {
  constructor() {
    this.textToTranslate = document.querySelector('#text-to-translate');
    this.translatedText = document.querySelector('#translated-text');
    this.languageSelector = document.querySelector('#language-selector');
    this.configParams = document.querySelector('#config-params');
    this.translateServerProtocol = document.querySelector('#translate-server-protocol');
    this.translateServerAddr = document.querySelector('#translate-server-address');
    this.translateServerPort = document.querySelector('#translate-server-port');
    this.translateServerPreview = document.querySelector('#translate-server-address-preview');
    this.translateServerCurrent = document.querySelector('#translate-server-address-current');
    this.serverAddressUpdate = document.querySelector('#server-address-update');
    this.logs = document.querySelector('#logs');
    this.nav = document.querySelector('nav');
    this.simulationLog = document.querySelector('#simulationLog');
    this.clientLog = document.querySelector('#clientLog');
    this.translationLog = document.querySelector('#translationLog');
  }
}
