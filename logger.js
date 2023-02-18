class Logger {
  constructor(apiUrl, interval) {
    this.apiUrl = apiUrl;
    this.interval = interval;
    this.logQueue = [];
    this.isSendingLogs = false;
    this.logTimer = null;
  }

  log(message) {
    this.addToQueue("log", message);
  }

  debug(message) {
    this.addToQueue("debug", message);
  }

  info(message) {
    this.addToQueue("info", message);
  }

  warn(message) {
    this.addToQueue("warn", message);
  }

  error(message) {
    this.addToQueue("error", message);
  }

  addToQueue(level, message) {
    const logData = {
      level: level,
      message: message,
      timestamp: new Date().toISOString()
    };

    this.logQueue.push(logData);

    if (!this.isSendingLogs) {
      this.startLogTimer();
    }
  }

  startLogTimer() {
    this.isSendingLogs = true;
    this.logTimer = setInterval(() => {
      this.sendLogs();
    }, this.interval);
  }

  sendLogs() {
    if (this.logQueue.length > 0) {
      const logData = this.logQueue.slice();
      this.logQueue = [];

      // Make a POST request to the server API endpoint to store the log data
      fetch(this.apiUrl, {
        method: "POST",
        body: JSON.stringify(logData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (response.ok) {
            console.log("Log data stored successfully");
          } else {
            console.error("Failed to store log data: " + response.statusText);
          }
        })
        .catch(error => {
          console.error("Error storing log data: " + error);
        });
    }

    if (this.logQueue.length === 0) {
      clearInterval(this.logTimer);
      this.isSendingLogs = false;
    }
  }
}

module.exports = Logger;
