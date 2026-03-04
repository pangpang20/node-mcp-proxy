/**
 * 项目常量定义
 */

/**
 * 默认 MCP 服务 URL
 */
export const DEFAULT_MCP_SERVER_URL = 'https://api.mcp.aliyun.com/v1';

/**
 * 默认超时时间（30 秒）
 */
export const DEFAULT_TIMEOUT_MS = 30000;

/**
 * 默认日志格式
 */
export const LOG_FORMAT = '[{timestamp}] [{level}] {message}';

/**
 * 消息大小限制（10MB）
 */
export const MAX_MESSAGE_SIZE = 10 * 1024 * 1024;

/**
 * 程序名称
 */
export const PROGRAM_NAME = 'node-mcp-proxy';

/**
 * 程序描述
 */
export const PROGRAM_DESCRIPTION = 'A lightweight MCP proxy server that forwards JSON-RPC 2.0 messages between stdio and HTTP';
