let WS;
const EL = {};

function toServer() {
  WS.send(JSON.stringify({
    text: EL.textToTranslate.value,
    target: EL.languageSelector.value
  }));
}

function fromServer(e) {
  EL.translatedText.textContent = e.data;
}

function updateWebSocket() {
  WS = new WebSocket('ws://' + EL.translateServerAddress.value);
  WS.addEventListener('message', fromServer);
}

function initElements() {
  EL.textToTranslate = document.querySelector('#text-to-translate');
  EL.translatedText = document.querySelector('#translated-text');
  EL.languageSelector = document.querySelector('#language-selector');
  EL.translateServerAddress = document.querySelector('#translate-server-address');
  EL.serverAddressUpdate = document.querySelector('#server-address-update');
}

function addEventListeners() {
  EL.textToTranslate.addEventListener('keyup', toServer);
  EL.languageSelector.addEventListener('change', toServer);
  EL.serverAddressUpdate.addEventListener('click', updateWebSocket);
}

function init() {
  initElements();
  EL.translateServerAddress.value = window.location.hostname + ':' + (window.location.port || '80');
  addEventListeners();
  updateWebSocket();
}

window.addEventListener('load', init)
