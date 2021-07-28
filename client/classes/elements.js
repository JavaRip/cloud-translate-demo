export class Elements {
  constructor() {
    this.wrapper = document.querySelector('#wrapper');
    this.textToTranslate = document.querySelector('#text-to-translate');
    this.translatedText = document.querySelector('#translated-text');
    this.languageSelector = document.querySelector('#language-selector');
    this.translateServerAddr = document.querySelector('#translate-server-address');
    this.serverAddressUpdate = document.querySelector('#server-address-update');
    this.numberOfClients = document.querySelector('#number-of-clients');
    this.startStressTest = document.querySelector('#start-stress-test');
    this.stopStessTest = document.querySelector('#stop-stress-test');
    this.startAllLanguagesTest = document.querySelector('#start-all-languages-test');
    this.stopAllLanguagesTest = document.querySelector('#stop-all-languages-test');
    this.startButtons = document.querySelectorAll('.start-button');
    this.stopButtons = document.querySelectorAll('.stop-button');
    this.stressTestDuration = document.querySelector('#stress-test-duration');
    this.allLangaugesTestDuration = document.querySelector('#all-languages-test-duration');
    this.translationsRequested = document.querySelector('#translations-requested');
    this.translationsReceived = document.querySelector('#translations-received');
    this.logs = document.querySelector('#logs');
    this.responseTime = document.querySelector('#response-time');
    this.plusButtons = document.querySelectorAll('.plus-button');
    this.minusButtons = document.querySelectorAll('.minus-button');
    this.translationsPie = document.querySelector('#translations-pie');
    this.nav = document.querySelector('nav');
    this.simulationLog = document.querySelector('#simulationLog');
    this.clientLog = document.querySelector('#clientLog');
    this.translationLog = document.querySelector('#translationLog');
  }
}
