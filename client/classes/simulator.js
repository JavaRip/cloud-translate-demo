export class Simulator {
  constructor(clients, runTime) {
    this.clients = clients;
    this.runTime = runTime;
    this.boundStop = this.stop.bind(this);
    this.boundSkimClients = this.skimClients.bind(this);
    this.skimIntervalId = null;

    // stats
    this.translationsReceived = null;
    this.translationsRequested = null;
    this.averageResponseTime = null;
  }

  init() {
    setTimeout(this.boundStop, this.runTime);
    this.skimIntervalId = setInterval(this.boundSkimClients, 500);
    for (const client of this.clients) {
      client.init();
    }
  }

  stop() {
    for (const client of this.clients) {
      client.stop();
    }

    // wait for translations which have still not arrived from server
    setTimeout(() => window.clearInterval(this.skimIntervalId), 1000);
  }

  skimClients() {
    this.translationsRequested = this.getTotReq(this.clients);
    this.translationsReceived = this.getTotRec(this.clients);
    this.averageResponseTime = this.getAvgResTime(this.clients);
    for (const client of this.clients) {
      console.log(client.intervalId);
      console.log(client.translationsRequested);
      console.log(client.translationsReceived);
      console.log('translations requested: ' + client.translationsRequested.length);
      console.log('translations received: ' + client.translationsReceived.length);
      console.log('average response time: ' + this.getAvgResTime(client));
      console.log('--------');
    }
  }

  getTotReq(clients) {
    let totalRequests = 0;
    for (const client of clients) {
      totalRequests += client.translationsRequested.length;
    }
    return totalRequests;
  }

  getTotRec(clients) {
    let totalReceived = 0;
    for (const client of clients) {
      totalReceived += client.translationsReceived.length;
    }
    return totalReceived;
  }

  getAvgResTime(clients) {
    let allTransRec = [];
    for (const client of clients) {
      allTransRec = allTransRec.concat(client.translationsReceived);
    }

    // return 0 if no translations have been received
    if (allTransRec.length === 0) return 0;

    const allResTimes = allTransRec.map(trans => trans.resTime);
    const allResTimesSum = allResTimes.reduce((a, b) => a + b);
    const averageResTime = allResTimesSum / allResTimes.length;

    return averageResTime;
  }
}
