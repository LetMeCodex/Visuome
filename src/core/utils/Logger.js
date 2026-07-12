export class Logger {
  constructor(moduleName, minLevel = "INFO") {
    this.moduleName = moduleName;
    this.minLevel = minLevel;
    this.history = [];
  }

  static LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
    CRITICAL: 4
  };

  /**
   * Publish log entry internally and to console if level permits.
   * @param {'DEBUG'|'INFO'|'WARNING'|'ERROR'|'CRITICAL'} level
   * @param {string} message
   * @param {any[]} args
   */
  log(level, message, ...args) {
    const levelVal = Logger.LEVELS[level] ?? 1;
    const minVal = Logger.LEVELS[this.minLevel] ?? 1;

    const logEntry = {
      level,
      module: this.moduleName,
      message,
      timestamp: new Date().toISOString(),
      args
    };
    this.history.push(logEntry);

    // Prune history to prevent memory leak
    if (this.history.length > 500) {
      this.history.shift();
    }

    if (levelVal >= minVal) {
      const consoleMsg = `[Visuome::${this.moduleName}] [${level}] ${message}`;
      switch (level) {
        case "DEBUG":
          console.debug(consoleMsg, ...args);
          break;
        case "INFO":
          console.log(consoleMsg, ...args);
          break;
        case "WARNING":
          console.warn(consoleMsg, ...args);
          break;
        case "ERROR":
        case "CRITICAL":
          console.error(consoleMsg, ...args);
          break;
      }
    }
  }

  debug(message, ...args) { this.log("DEBUG", message, ...args); }
  info(message, ...args) { this.log("INFO", message, ...args); }
  warn(message, ...args) { this.log("WARNING", message, ...args); }
  error(message, ...args) { this.log("ERROR", message, ...args); }
  critical(message, ...args) { this.log("CRITICAL", message, ...args); }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

const loggers = new Map();

/**
 * Helper to fetch a module-scoped Logger singleton.
 * @param {string} moduleName
 * @param {'DEBUG'|'INFO'|'WARNING'|'ERROR'|'CRITICAL'} minLevel
 * @returns {Logger}
 */
export function getLogger(moduleName, minLevel = "INFO") {
  if (!loggers.has(moduleName)) {
    loggers.set(moduleName, new Logger(moduleName, minLevel));
  }
  return loggers.get(moduleName);
}
