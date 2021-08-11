export class Elements {
  constructor() {
    this.wrapper = document.querySelector('#wrapper');
    this.textToTranslate = document.querySelector('#text-to-translate');
    this.manualTranslatedText = document.querySelector('#manual-translated-text');
    this.manualLanguageSelector = document.querySelector('#manual-language-selector');
    this.configParams = document.querySelector('#config-params');
    this.translateServerProtocol = document.querySelector('#translate-server-protocol');
    this.translateServerAddr = document.querySelector('#translate-server-address');
    this.translateServerPort = document.querySelector('#translate-server-port');
    this.translateServerPreview = document.querySelector('#translate-server-address-preview');
    this.translateServerCurrent = document.querySelector('#translate-server-address-current');
    this.serverAddressUpdate = document.querySelector('#server-address-update');
    this.logs = document.querySelector('#logs');
    this.nav = document.querySelector('nav');
    this.simulationLog = document.querySelector('#simulation-log');
    this.clientLog = document.querySelector('#client-log');
    this.translationLog = document.querySelector('#translation-log');
    this.demoLanguageSelector = document.querySelector('#demo-language-selector');
    this.demoTranslations = document.querySelector('#demo-translations');
    this.demoTranslatedText = document.querySelector('#demo-translated-text');
    this.languageSelectors = document.querySelectorAll('.language-selector');
    this.startDemo = document.querySelector('#start-demo');
  }
}
