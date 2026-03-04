import { loadCliConfig, parseArgs } from './cli.js';
import { StdioHandler } from './core/stdio-handler.js';
import { HttpClient } from './core/http-client.js';
import { MessageRouter } from './core/message-router.js';
import { logger, setDebugMode } from './utils/logger.js';
import { createErrorResponse, JsonRpcErrorCode } from './utils/errors.js';

/**
 * 主函数
 */
async function main(): Promise<void> {
  // 检查是否是帮助或版本请求
  parseArgs();

  // 加载配置
  let config;
  try {
    config = loadCliConfig();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(errorMessage);
    process.exit(1);
  }

  // 设置 debug 模式
  setDebugMode(config.debug);

  logger.info('Starting node-mcp-proxy');
  logger.debug(`Configuration: url=${config.mcpServerUrl}, timeout=${config.timeout}ms, debug=${config.debug}`);

  // 创建核心组件
  const stdioHandler = new StdioHandler();
  const httpClient = new HttpClient(config);
  const messageRouter = new MessageRouter(httpClient);

  // 设置消息处理回调
  stdioHandler.onMessage(async (message: string) => {
    try {
      const response = await messageRouter.handleRawMessage(message);
      stdioHandler.sendResponse(JSON.stringify(response));
    } catch (error) {
      // 这是一个不应该发生的内部错误
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Unexpected error: ${errorMessage}`);

      const errorResponse = createErrorResponse(
        null,
        JsonRpcErrorCode.InternalError,
        `Internal error: ${errorMessage}`
      );
      stdioHandler.sendResponse(JSON.stringify(errorResponse));
    }
  });

  // 处理关闭事件
  stdioHandler.onClose(() => {
    logger.info('stdin closed, shutting down');
    stdioHandler.stop();
    process.exit(0);
  });

  // 处理错误事件
  stdioHandler.onError((error: Error) => {
    logger.error('stdio error', error);
    process.exit(1);
  });

  // 处理进程退出信号
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    stdioHandler.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // 启动 stdio 处理
  stdioHandler.start();

  logger.info('node-mcp-proxy is ready to forward messages');
}

// 启动程序
main().catch((error) => {
  logger.error('Fatal error', error);
  process.exit(1);
});
