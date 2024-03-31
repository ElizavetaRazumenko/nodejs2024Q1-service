import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger, LogLevel, LoggerService } from '@nestjs/common';
import { LoggerError } from './types';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logLevel = process.env.LOG_LEVEL || 'verbose';
  private logLevelValues = {
    log: 0,
    error: 1,
    warn: 2,
    debug: 3,
    verbose: 4,
  };

  private maxSizeKb = parseInt(process.env.MAX_LOG_FILE_SIZE_KB, 10) || 1024;

  private pathToLogFile = path.resolve(__dirname, '../../logs/application.log');
  private pathToErrorFile = path.resolve(__dirname, '../../logs/error.log');

  private logger = new Logger();

  public log(message: string) {
    this.writeLog('log', message);
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
    let log = `${new Date().toISOString()} [error] - ${message}`;

    if (trace) {
      log += `\nTrace: ${trace}`;
    }

    if (statusCode) {
      log += `\nStatus Code: ${statusCode}`;
    }

    if (url) {
      log += `\nURL: ${url}`;
    }

    if (method) {
      log += `\nMethod: ${method}`;
    }

    if (headers) {
      log += `\nHeaders: ${JSON.stringify(headers)}`;
    }

    if (query) {
      log += `\nQuery: ${JSON.stringify(query)}`;
    }

    if (body) {
      log += `\nBody: ${JSON.stringify(body)}`;
    }

    if (errorResponse) {
      log += `\nError Response: ${JSON.stringify(errorResponse)}`;
    }

    this.writeLog('error', log, true);
  }

  public warn(message: string) {
    this.writeLog('warn', message);
  }

  public verbose(message: string) {
    this.writeLog('verbose', message);
  }

  public debug(message: string) {
    this.writeLog('debug', message);
  }

  private writeLog(level: LogLevel, message: string, isError = false) {
    if (this.isShouldBeLog(level)) {
      const filePath = isError ? this.pathToErrorFile : this.pathToLogFile;
      this.writeLogToFile(filePath, level, message);
    }
  }

  private writeLogToFile(
    path: string,
    level: LogLevel,
    message: string,
    trace?: string,
  ) {
    const log = `${new Date().toISOString()} [${level}] - ${message}${
      trace ? '\nTrace: ' + trace : ''
    }\n`;

    fs.stat(path, (error, status) => {
      if (!error && status.size > this.maxSizeKb * 1024) {
        const backupPath = path.replace('.log', `_backup_${Date.now()}.log`);
        fs.rename(path, backupPath, (renameErr) => {
          if (renameErr) {
            this.logger.error(`Error renaming log file: ${renameErr}`);
          }
        });
      }
    });

    fs.appendFile(path, log, (error) => {
      if (error) {
        this.logger.error(`Error writing log to ${path}: ${error}`);
      }
    });
  }

  private isShouldBeLog(level: LogLevel): boolean {
    return this.logLevelValues[level] >= this.logLevelValues[this.logLevel];
  }
}
