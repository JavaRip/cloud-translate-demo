export class Config {
  constructor(elements) {
    this.protocolEl = elements.translateServerProtocol;
    this.addressEl = elements.translateServerAddr;
    this.portEl = elements.translateServerPort;
    this.previewEl = elements.translateServerPreview;
    this.currentAddressEl = elements.translateServerCurrent;
    this.languageSelectors = elements.languageSelectors;
    this.serverAddressUpdate = elements.serverAddressUpdate;
    this.translateServerCurrent = elements.translateServerCurrent;
    this.translateServerPreview = elements.translateServerPreview;
    this.configParams = elements.configParams;
  }

  init(languageCodes, manualTranslator) {
    // init language selectors
    for (const languageSelector of this.languageSelectors) {
      for (const language of languageCodes) {
        const optionEl = document.createElement('option');
        optionEl.value = language.code;
        optionEl.textContent = `${language.name} [${language.code}]`;
        languageSelector.appendChild(optionEl);
      }
    }

    // init event listeners
    this.serverAddressUpdate.addEventListener('click', () => {
      this.translateServerCurrent.textContent = this.translateServerPreview.textContent;
      manualTranslator.updateWebSocket(this.getWsAddr());
    });

    for (const element of this.configParams.querySelectorAll('input')) {
      element.addEventListener('change', this.updateWsAddrPreview);
    }

    // init translate server view
    this.setTranslateServer();
  }

  setTranslateServer() {
    this.protocolEl.value = 'ws';
    this.addressEl.value = `${window.location.hostname}`;
    this.portEl.value = '9999';

    const wsAddress = `${this.protocolEl.value}://${this.addressEl.value}:${this.portEl.value}`;

    this.previewEl.value = wsAddress;
    this.currentAddressEl.value = wsAddress;
  }

  updateWsAddrPreview() {
    const protocol = this.protocolEl.value;
    const hostname = this.addressEl.value;
    const port = this.portEl.value;
    const wsAddress = (port === '')
      ? `${protocol}://${hostname}`
      : `${protocol}://${hostname}:${port}`;

    this.previewEl.textContent = wsAddress;
  }


  getWsAddr() {
    return this.currentAddressEl.value;
  }
}
