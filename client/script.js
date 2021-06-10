let ws = new WebSocket('ws://' + window.location.hostname + ':' + (window.location.port || '80'));
const textToTranslate = document.querySelector('#text-to-translate');
const translatedText = document.querySelector('#translated-text');
const languageSelector = document.querySelector('#language-selector');
const translateServerAddress = document.querySelector('#translate-server-address');
const serverAddressUpdate = document.querySelector('#server-address-update');

function toServer() {
  ws.send(JSON.stringify({
    text: textToTranslate.value,
    target: languageSelector.value
  }));
}

function fromServer(e) {
  translatedText.textContent = e.data;
}

function updateWebSocket() {
  ws = new WebSocket('ws://' + translateServerAddress.value);
  ws.addEventListener('message', fromServer);
}

function init() {
  translateServerAddress.value = window.location.hostname + ':' + (window.location.port || '80');
  textToTranslate.addEventListener('keyup', toServer);
  languageSelector.addEventListener('change', toServer);
  serverAddressUpdate.addEventListener('click', updateWebSocket);
  updateWebSocket();
}

window.addEventListener('load', init)
