/**
 * 代理服务配置接口
 */
export interface ProxyConfig {
  /** MCP 服务器 URL */
  mcpServerUrl: string;
  /** API Key 用于认证 */
  apiKey: string;
  /** 请求超时时间（毫秒） */
  timeout: number;
  /** 是否启用调试模式 */
  debug: boolean;
}

/**
 * 环境变量名称常量
 */
export const EnvVarName = {
  API_KEY: 'MCP_API_KEY',
  SERVER_URL: 'MCP_SERVER_URL',
  TIMEOUT: 'MCP_TIMEOUT',
  DEBUG: 'MCP_DEBUG',
} as const;

/**
 * 默认配置值
 */
export const DefaultConfig = {
  SERVER_URL: 'https://api.mcp.aliyun.com/v1',
  TIMEOUT: 30000,
  DEBUG: false,
} as const;
