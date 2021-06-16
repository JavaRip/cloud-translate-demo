export class Simulator {
  constructor(clients, runTime) {
    this.clients = clients;
    this.runTime = runTime;
    this.boundStop = this.stop.bind(this);
  }

  init() {
    setTimeout(this.boundStop, this.runTime);
    for (const client of this.clientArr) {
      client.init();
    }
  }

  stop() {
    for (const client of this.clientArr) {
      client.stop();
    }
  }
}
