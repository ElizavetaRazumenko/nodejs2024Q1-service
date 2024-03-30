import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  log(message: string) {
    console.log(`[Log]: ${message}`);
  }

  warn(message: string) {
    console.warn(`[Warning]: ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`[Error]: ${message}, Trace: ${trace}`);
  }

  verbose(message: string) {
    console.log(`[Verbose]: ${message}`);
  }

  debug(message: string) {
    console.debug(`[Debug]: ${message}`);
  }
}
