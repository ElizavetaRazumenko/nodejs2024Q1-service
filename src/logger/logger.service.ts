import { ConsoleLogger, Injectable } from '@nestjs/common';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import * as fsPromises from 'node:fs/promises';
import { LOGS } from './types';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private logCount: number;
  private errorCount: number;
  private level: number;
  private maxLogFileSize: number;

  constructor() {
    super();
    this.logCount = 1;
    this.errorCount = 1;
    this.level = +process.env.LOG_LEVEL || 2;
    this.maxLogFileSize = +process.env.MAX_LOG_FILE_SIZE_KB || 5000;
  }

  log(msg: string, context: string) {
    if (this.level >= 2)
      this.logging(LOGS.log, `${msg}`, context || this.context);
  }

  warn(msg: string, context: string) {
    if (this.level >= 1)
      this.logging(LOGS.warn, `${msg}`, context || this.context);
  }

  error(msg: string, trace: string, context?: string) {
    if (this.level >= 0)
      this.logging(LOGS.error, `${msg}\n${trace}`, context || this.context);
  }

  debug(msg: string, context: string) {
    if (this.level >= 4)
      this.logging(LOGS.debug, `${msg}`, context || this.context);
  }

  verbose(msg: string, context: string) {
    if (this.level >= 3)
      this.logging(LOGS.verbose, `${msg}`, context || this.context);
  }

  private async writeLogging(count: number, message: string, file: string) {
    const logDir = join(process.cwd(), 'logs');

    if (!existsSync(logDir)) {
      await fsPromises.mkdir(logDir, { recursive: true });
    }

    let filePath = resolve(logDir, `${file}_${count}.log`);

    if (!existsSync(filePath)) {
      await fsPromises.writeFile(filePath, '');
    }

    const { size } = await fsPromises.stat(filePath);

    if (size >= this.maxLogFileSize) {
      count++;
    }

    filePath = resolve(logDir, `${file}_${count}.log`);

    await fsPromises.writeFile(filePath, message, { flag: 'a' });

    return count;
  }

  private async logging(level: string, message: string, context: string) {
    const logMessage = `[${this.getTimestamp()}] [${level.toUpperCase()}] [${
      context || ''
    }] - [${message}]\n`;

    super[level](logMessage);

    switch (level) {
      case LOGS.error:
        this.errorCount = await this.writeLogging(
          this.errorCount,
          logMessage,
          'errors',
        );
        break;
      default:
        this.logCount = await this.writeLogging(
          this.logCount,
          logMessage,
          'logs',
        );
        break;
    }
  }
}
