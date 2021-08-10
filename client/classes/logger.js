import { StatGenerator } from './statGenerator.js';

export class Logger extends StatGenerator {
  async saveLogs(logs) {
    // save to local storage

    if (true) return true;
    else console.error('Failed to send logs to server.');
  }

  async getLogs() {
    // load from local storage

    return true;
  }

  displayLogs(logs, logsEl, simulationLog, clientLog, translationLog) {
    // display logs
    // get log from local storage, only show one at a time (most recent simulation)
    return true;
    for (const log of logs) {
      const logRowTemplate = document.importNode(simulationLog.content, true);
      const logRow = logRowTemplate.querySelector('.simulationLogRow');
      const clientLogsEl = logRowTemplate.querySelector('.clientLogs');

      // format data to display
      const translatorAddress = log.clients[0].translatorWebsocket;
      const duration =
        ((Number(log.simulationStop) - Number(log.simulationStart)) / 1000).toFixed(2);
      const startTime = new Date(log.simulationStart).toISOString();
      const totalRequests = this.getTotReq(log.clients);
      const totalReceipts = this.getTotRec(log.clients);
      const avgResponseTime = this.getAvgResTime(log.clients);

      // display formatted data
      logRow.querySelector('.translatorAddress').textContent = translatorAddress;
      logRow.querySelector('.startTime').textContent = startTime;
      logRow.querySelector('.duration').textContent = duration;
      logRow.querySelector('.totalTranslationsRequested').textContent = totalRequests;
      logRow.querySelector('.totalTranslationsReceived').textContent = totalReceipts;
      logRow.querySelector('.averageResponseTime').textContent = avgResponseTime;

      for (const client of log.clients) {
        const clientLogRowTemplate = document.importNode(clientLog.content, true);
        const clientLogRow = clientLogRowTemplate.querySelector('.clientLogRow');
        const requestLogsEl = clientLogRow.querySelector('.translationLogs');

        const translationsRequested = client.translationsRequested.length;
        const translationsReceived = client.translationsReceived.length;

        clientLogRow.querySelector('.targetLang').textContent = client.targetLanguage;
        clientLogRow.querySelector('.translationsRequested').textContent = translationsRequested;
        clientLogRow.querySelector('.translationsReceived').textContent = translationsReceived;

        for (const request of client.translationsRequested) {
          const translationLogTemplate = document.importNode(translationLog.content, true);
          const translationLogRow = translationLogTemplate.querySelector('.translationLogRow');

          const response = findResponse(request, client.translationsReceived);

          translationLogRow.querySelector('.request').textContent = request.text;

          if (response) {
            translationLogRow.querySelector('.response').textContent = response.translation;
            translationLogRow.querySelector('.timeTaken').textContent = `${response.resTime}ms`;
          } else {
            translationLogRow.querySelector('.response').classList.add('noTranslation');
            translationLogRow.querySelector('.response').textContent = 'Translation not received';
            translationLogRow.querySelector('.timeTaken').textContent = 'N/A';
          }

          requestLogsEl.appendChild(translationLogRow);
        }
        clientLogsEl.appendChild(clientLogRow);
      }
      logsEl.appendChild(logRow);
    }

    const dropDownSelectors = ['.clientLogsHeading', '.translationLogsHeading'];

    for (const dropDown of document.querySelectorAll(dropDownSelectors)) {
      dropDown.addEventListener('click', (event) => {
        event.target.classList.toggle('selected');
      });
    }

    function findResponse(request, responses) {
      // search for response in list of responses and return when found
      for (const response of responses) {
        if (JSON.stringify(response.request) === JSON.stringify(request)) {
          return response;
        }
      }

      // if reponse not found return
      return false;
    }
  }
}
