const ws = new WebSocket('ws://' + window.location.hostname + ':' +
  (window.location.port || 80) + '/');
const textToTranslate = document.querySelector('#text-to-translate');
const translatedText = document.querySelector('#translated-text');
const languageSelector = document.querySelector('#language-selector');

function toServer(e) {
  ws.send(JSON.stringify({
    text: textToTranslate.value,
    target: languageSelector.value
  }));
}

function fromServer(e) {
  translatedText.textContent = e.data;
  console.log(e);
}

textToTranslate.addEventListener('keyup', toServer);
languageSelector.addEventListener('change', toServer);
ws.addEventListener('message', fromServer);
