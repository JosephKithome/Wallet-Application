import winston from "winston";

export class CustomLogger {
  logger: any;
  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
        new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
        new winston.transports.File({ filename: 'warn.log', level: 'warn' }),
      ]
    });
  }

  logInfo(message: string, level = 'info') {
    this.logger.log({
      level: level,
      message: message
    });
  }
  logError(message: string, level = 'error') {
    this.logger.log({
      level: level,
      message: message
    });
  }
  logDebug(message: string, level = 'debug') {
    this.logger.log({
      level: level,
      message: message
    });
  }

  logWarn(message: string, level = 'warn') {
    this.logger.log({
      level: level,
      message: message
    });
  }
}

