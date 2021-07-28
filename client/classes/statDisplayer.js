import { Pie } from './pie.js';

export class StatDisplayer extends Pie {
  constructor(elements) {
    super(elements.translationsPie);
    this.statRefreshId = null;
    this.translationsReceived = elements.translationsReceived;
    this.translationsRequested = elements.translationsRequested;
    this.responseTime = elements.responseTime;
  }

  displayStats(simulation) {
    // dispatch event simulation started
    this.statRefreshId = setInterval(() => {
      simulation.getStats();
      this.translationsReceived.textContent = simulation.translationsReceived;
      this.translationsRequested.textContent = simulation.translationsRequested;
      this.responseTime.textContent = simulation.averageResponseTime + 'ms';

      const succTranslations = simulation.translationsRequested + simulation.translationsReceived;
      const failedTranslations = simulation.translationsRequested - simulation.translationsReceived;
      this.draw([
        { label: 'Successful Translations', value: succTranslations },
        { label: 'Failed Translations', value: failedTranslations },
      ]);
    }, 500);

    setTimeout(() => {
      window.clearInterval(this.statRefreshId);
    }, simulation.runTime + 1000);
  }

  stopRefreshing() {
    window.clearInterval(this.statRefreshId);
  }
}
