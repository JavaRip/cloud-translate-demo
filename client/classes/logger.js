export class Logger {
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
    const res = await fetch('/logs');
    return await res.json(res);
  }
}
