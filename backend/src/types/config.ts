/**
 * Configuration types for RSS Renaissance Backend
 */

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiVersion: string;
  corsOrigins: string[];
  rateLimit: {
    max: number;
    timeWindow: number;
  };
  redis: {
    url: string;
    password?: string;
    db: number;
  };
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  feed: {
    userAgent: string;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
  };
  logging: {
    level: string;
    pretty: boolean;
  };
}

export interface ServiceContext {
  database: any;
  redis: any;
  jobs: any;
  logger: any;
}

// Extend Fastify request type
declare module 'fastify' {
  interface FastifyRequest {
    services: ServiceContext;
  }
}
