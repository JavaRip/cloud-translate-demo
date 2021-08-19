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

    // init translate server view
    this.setTranslateServer();
    this.updateWsAddrPreview(this);

    // init event listeners
    this.serverAddressUpdate.addEventListener('click', () => { this.updateWsAddrCurrent(this, manualTranslator); });

    for (const element of this.configParams.querySelectorAll('input')) {
      console.log('cahgne');
      element.addEventListener('change', () => { this.updateWsAddrPreview(this); });
    }
  }

  setTranslateServer() {
    this.protocolEl.value = 'ws';
    this.addressEl.value = `${window.location.hostname}`;
    this.portEl.value = '9999';

    const wsAddress = `${this.protocolEl.value}://${this.addressEl.value}:${this.portEl.value}`;

    this.previewEl.value = wsAddress;
    console.log(this.currentAddressEl);
    this.currentAddressEl.textContent = wsAddress;
  }

  updateWsAddrPreview(self) {
    const protocol = self.protocolEl.value;
    const hostname = self.addressEl.value;
    const port = self.portEl.value;
    const wsAddress = (port === '')
      ? `${protocol}://${hostname}`
      : `${protocol}://${hostname}:${port}`;

    self.previewEl.textContent = wsAddress;
  }

  updateWsAddrCurrent(self, manualTranslator) {
    self.translateServerCurrent.textContent = self.translateServerPreview.textContent;
    manualTranslator.updateWebSocket(self.getWsAddr());
  }

  getWsAddr() {
    return this.currentAddressEl.textContent;
  }
}
