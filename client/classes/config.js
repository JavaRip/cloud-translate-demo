export class Config {
  constructor(elements) {
    this.protocolEl = elements.translateServerProtocol;
    this.addressEl = elements.translateServerAddr;
    this.portEl = elements.translateServerPort;
    this.previewEl = elements.translateServerPreview;
    this.currentAddressEl = elements.translateServerCurrent;
  }

  setTranslateServer() {
    this.protocolEl.value = 'ws';
    this.addressEl.value = `${window.location.hostname}`;
    this.portEl.value = '9999';

    const wsAddress = `${this.protocolEl.value}://${this.addressEl.value}:${this.portEl.value}`;

    this.previewEl.value = wsAddress;
    this.currentAddressEl.value = wsAddress;
  }

  init(languageSelectors, languageCodes, elements, manualTranslator) {
    // init language selectors
    for (const languageSelector of languageSelectors) {
      for (const language of languageCodes) {
        const optionEl = document.createElement('option');
        optionEl.value = language.code;
        optionEl.textContent = `${language.name} [${language.code}]`;
        languageSelector.appendChild(optionEl);
      }
    }

    // init event listeners
    elements.serverAddressUpdate.addEventListener('click', () => {
      elements.translateServerCurrent.textContent = elements.translateServerPreview.textContent;
      manualTranslator.updateWebSocket(this.getWsAddr());
    });

    for (const element of elements.configParams.querySelectorAll('input')) {
      element.addEventListener('change', this.updateWsAddrPreview);
    }
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
