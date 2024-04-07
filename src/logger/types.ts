export type LoggerError = {
  url?: string;
  query?: any;
  method?: string;
  statusCode?: number;
  headers?: any;
  body?: any;
  message: string;
  trace?: string;
  errorResponse?: any;
};

export enum LOGS {
  log = 'log',
  error = 'error',
  warn = 'warn',
  debug = 'debug',
  verbose = 'verbose',
}
