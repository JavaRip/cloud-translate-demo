export class StatGenerator {
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
    const averageResTime = Math.floor(allResTimesSum / allResTimes.length);

    return averageResTime;
  }
}
