import winston, { createLogger, format, transports } from 'winston';

let logger: winston.Logger = null;

export const getLogger = () => {
  if (logger === null) {
    logger = createLogger({
      level: 'debug',
      format: format.json(),
      defaultMeta: { service: 'api' },
      transports: [
        new transports.File({ filename: '../logs/tasksjs-api.log' })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(new transports.Console({
        format: format.cli(),
      }));
    }
  }

  return logger;
}
