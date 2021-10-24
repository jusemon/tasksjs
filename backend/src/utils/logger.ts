import { createLogger, format, Logger, transports } from 'winston';
import { isDevMode } from './common';

let logger: Logger = null;

export const getLogger = () => {
  if (logger === null) {
    logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:MM:SS' }),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
      defaultMeta: { service: 'api' },
      transports: [
        new transports.File({ filename: process.env.LOG_FILE })
      ],
    });

    if (isDevMode()) {
      const colorizer = format.colorize();
      logger.add(new transports.Console({
        format: format.printf(info => colorizer.colorize(info.level, `[${info.timestamp}] ${info.level}: ${info.message}`))
      }));
    }
  }

  return logger;
}
