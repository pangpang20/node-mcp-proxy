import * as readline from 'readline';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

/**
 * stdio 处理类
 * 负责从 stdin 读取 JSON 消息并将响应写入 stdout
 */
export class StdioHandler extends EventEmitter {
  private rl: readline.Interface | null = null;
  private isRunning: boolean = false;

  /**
   * 启动 stdio 监听
   */
  start(): void {
    if (this.isRunning) {
      logger.warn('StdioHandler is already running');
      return;
    }

    this.isRunning = true;
    logger.debug('Starting stdio handler');

    this.rl = readline.createInterface({
      input: process.stdin,
      crlfDelay: Infinity,
    });

    this.rl.on('line', (line: string) => {
      this.handleLine(line);
    });

    this.rl.on('close', () => {
      logger.debug('stdin closed');
      this.emit('close');
    });

    this.rl.on('error', (error: Error) => {
      logger.error('stdin error', error);
      this.emit('error', error);
    });
  }

  /**
   * 停止 stdio 监听
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    logger.debug('Stopping stdio handler');

    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }

    this.isRunning = false;
  }

  /**
   * 处理单行输入
   */
  private handleLine(line: string): void {
    const trimmedLine = line.trim();

    // 忽略空行
    if (!trimmedLine) {
      return;
    }

    logger.debug(`Received line: ${trimmedLine.slice(0, 100)}${trimmedLine.length > 100 ? '...' : ''}`);
    this.emit('message', trimmedLine);
  }

  /**
   * 发送响应到 stdout
   */
  sendResponse(response: string): void {
    if (!this.isRunning) {
      logger.warn('Cannot send response: stdio handler is not running');
      return;
    }

    process.stdout.write(`${response}\n`);
    logger.debug(`Sent response: ${response.slice(0, 100)}${response.length > 100 ? '...' : ''}`);
  }

  /**
   * 设置消息回调
   */
  onMessage(callback: (message: string) => void): void {
    this.on('message', callback);
  }

  /**
   * 设置关闭回调
   */
  onClose(callback: () => void): void {
    this.on('close', callback);
  }

  /**
   * 设置错误回调
   */
  onError(callback: (error: Error) => void): void {
    this.on('error', callback);
  }
}
