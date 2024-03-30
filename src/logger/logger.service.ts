import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger, LogLevel, LoggerService } from '@nestjs/common';
import { LoggerError } from './types';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logLevel = process.env.LOG_LEVEL as LogLevel;
  private logLevelValues = {
    log: 0,
    error: 1,
    warn: 2,
    debug: 3,
    verbose: 4,
  };

  private maxSizeKb: number =
    parseInt(process.env.MAX_LOG_FILE_SIZE_KB, 10) || 1024;

  private pathToLogFile = path.resolve(__dirname, '../../logs/application.log');
  private pathToErrorFile = path.resolve(__dirname, '../../logs/error.log');

  private logger = new Logger();

  public log(message: string) {
    this.writeLog(this.pathToLogFile, 'log', message);
  }

  public error({
    url,
    query,
    method,
    statusCode,
    headers,
    body,
    message,
    trace,
    errorResponse,
  }: LoggerError) {
    let log = `${new Date().toISOString()} [error] - ${message}${
      trace ? '\nTrace: ' + trace : ''
    }\n`;

    if (statusCode) {
      log += `Status Code: ${statusCode}\n`;
    }

    if (url) {
      log += `URL: ${url}\n`;
    }

    if (method) {
      log += `Method: ${method}\n`;
    }

    if (headers) {
      log += `Headers: ${JSON.stringify(headers)}\n`;
    }

    if (query) {
      log += `Query: ${JSON.stringify(query)}\n`;
    }

    if (body) {
      log += `Body: ${JSON.stringify(body)}\n`;
    }

    if (errorResponse) {
      log += `Error Response: ${JSON.stringify(errorResponse)}\n`;
    }

    this.writeLog(this.pathToErrorFile, 'error', log);
  }

  public warn(message: string) {
    this.writeLog(this.pathToLogFile, 'warn', message);
  }

  public debug(message: string) {
    if (this.isShouldBeLog('debug')) {
      this.writeLog(this.pathToLogFile, 'debug', message);
    }
  }

  public verbose(message: string) {
    if (this.isShouldBeLog('verbose')) {
      this.writeLog(this.pathToLogFile, 'verbose', message);
    }
  }

  private writeLog(
    filePath: string,
    level: LogLevel,
    message: string,
    trace?: string,
  ) {
    const log = `${new Date().toISOString()} [${level}] - ${message}${
      trace ? '\nTrace: ' + trace : ''
    }\n`;

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.size > this.maxSizeKb * 1024) {
        const backupPath = filePath.replace(
          '.log',
          `_backup_${Date.now()}.log`,
        );
        fs.rename(filePath, backupPath, (renameErr) => {
          if (renameErr) {
            this.logger.error(`Error renaming log file: ${renameErr}`);
          }
        });
      }
    });

    fs.appendFile(filePath, log, (err) => {
      if (err) {
        this.logger.error(`Error writing log to ${filePath}: ${err}`);
      }
    });
  }

  private isShouldBeLog(level: LogLevel): boolean {
    return this.logLevelValues[level] >= this.logLevelValues[this.logLevel];
  }
}
