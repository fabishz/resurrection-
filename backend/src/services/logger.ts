/**
 * Logger Service - Centralized logging with Pino
 */

import pino from 'pino';

export class LoggerService {
  private static instance: pino.Logger;

  static getInstance(config: { level: string; pretty: boolean }): pino.Logger {
    if (!LoggerService.instance) {
      LoggerService.instance = pino({
        level: config.level,
        ...(config.pretty && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }),
        formatters: {
          level: (label) => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
          pid: process.pid,
          hostname: process.env.HOSTNAME || 'unknown',
          service: 'rss-renaissance-backend',
        },
      });
    }
    return LoggerService.instance;
  }

  static createChild(bindings: Record<string, any>): pino.Logger {
    return LoggerService.getInstance({ level: 'info', pretty: false }).child(bindings);
  }
}
