import { StatGenerator } from './statGenerator.js';

export class Logger extends StatGenerator {
  async saveLogs(logs) {
    const response = await fetch('/saveLogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs: logs }),
    });

    if (response.ok) return true;
    else console.error('Failed to send logs to server.');
  }

  async getLogs() {
    const response = await fetch('/logs');
    if (response.ok) return await response.json(response);
    else console.error('Failed to get logs from server');
  }

  displayLogs(logs, logsEl, simulationLog, clientLog) {
    // display logs
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
      logRow.querySelector('.totalTranslationsSent').textContent = totalRequests;
      logRow.querySelector('.totalTranslationsReceived').textContent = totalReceipts;

      for (const client of log.clients) {
        const clientLogRowTemplate = document.importNode(clientLog.content, true);
        const clientLogRow = clientLogRowTemplate.querySelector('.clientLogRow');
        const translationsRequested = client.translationsRequested.length;
        const translationsReceived = client.translationsReceived.length;
        console.log(translationsRequested);

        clientLogRow.querySelector('.targetLang').textContent = client.targetLanguage;
        clientLogRow.querySelector('.translationsSent').textContent = translationsRequested;
        clientLogRow.querySelector('.translationsReceived').textContent = translationsReceived;
        console.log(client);

        // logRow.querySelector('.tranlsationsSent').textContent = ;
        // logRow.querySelector('.tranlsationsReceived').textContent = ;
        // logRow.textContent = JSON.stringify(log);

        clientLogsEl.appendChild(clientLogRow);
      }

      logsEl.appendChild(logRow);
    }
  }
}
