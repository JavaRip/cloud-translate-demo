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
    const response = await fetch('/logs');
    if (response.ok) return await response.json(response);
    else console.error('Failed to get logs from server');
  }
}
