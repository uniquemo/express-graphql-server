enum LOG_TYPE {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const log = (type: LOG_TYPE) => (message: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}]:`);
  console.log(message);
};

const logger = {
  debug: log(LOG_TYPE.DEBUG),
  info: log(LOG_TYPE.INFO),
  warn: log(LOG_TYPE.WARN),
  error: log(LOG_TYPE.ERROR),
};

export default logger;
