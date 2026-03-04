/**
 * 日志级别枚举
 */
export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

/**
 * 日志工具类
 */
export class Logger {
  private debugMode: boolean;

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode;
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  /**
   * 脱敏 API Key
   */
  maskApiKey(apiKey: string): string {
    if (apiKey.length <= 8) {
      return '***';
    }
    return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
  }

  /**
   * 输出 debug 级别日志
   */
  debug(message: string): void {
    if (this.debugMode) {
      console.error(this.formatMessage(LogLevel.Debug, message));
    }
  }

  /**
   * 输出 info 级别日志
   */
  info(message: string): void {
    console.error(this.formatMessage(LogLevel.Info, message));
  }

  /**
   * 输出 warn 级别日志
   */
  warn(message: string): void {
    console.error(this.formatMessage(LogLevel.Warn, message));
  }

  /**
   * 输出 error 级别日志
   */
  error(message: string, error?: Error | unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullMessage = error ? `${message}: ${errorMessage}` : message;
    console.error(this.formatMessage(LogLevel.Error, fullMessage));
  }
}

/**
 * 创建默认 logger 实例
 */
export const logger = new Logger();

/**
 * 设置 logger 的 debug 模式
 */
export function setDebugMode(debug: boolean): void {
  logger.debugMode = debug;
}
