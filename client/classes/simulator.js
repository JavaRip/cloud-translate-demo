import { StatGenerator } from './statGenerator.js';

export class Simulator extends StatGenerator {
  constructor(clients, runTime) {
    super();
    this.clients = clients;
    this.runTime = runTime;
    this.startTimestamp = Date.now();
    this.boundStop = this.stop.bind(this);
    window.dispatchEvent(new CustomEvent('simulationStarted', { detail: this }));

    this.timeoutId = setTimeout(this.boundStop, this.runTime);
    for (const client of this.clients) {
      client.init();
    }

    // stats
    this.translationsReceived = null;
    this.translationsRequested = null;
    this.averageResponseTime = null;
  }

  async stop() {
    this.stopTimestamp = Date.now();
    for (const client of this.clients) {
      client.stop();
    }
    window.clearTimeout(this.timeoutId);

    // wait for client websockets to close
    await this.wait(1000);

    // this added to event so stop button knows which simulation to stop
    const logs = this.aggregateLogs();
    window.dispatchEvent(new CustomEvent('simulationStopped', { detail: logs }));
  }

  getStats() {
    this.translationsRequested = this.getTotReq(this.clients);
    this.translationsReceived = this.getTotRec(this.clients);
    this.averageResponseTime = this.getAvgResTime(this.clients);
  }

  aggregateLogs() {
    const simulationLog = {};
    simulationLog.simulationStart = this.startTimestamp;
    simulationLog.simulationStop = this.stopTimestamp;
    simulationLog.clients = [];
    for (const client of this.clients) {
      simulationLog.clients.push(client);
    }
    return simulationLog;
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
