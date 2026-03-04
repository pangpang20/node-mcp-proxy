import { ProxyConfig, EnvVarName, DefaultConfig } from '../types/config.js';

/**
 * 解析布尔值
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * 解析数字
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 加载配置
 * 优先级：命令行参数 > 环境变量 > 默认值
 */
export function loadConfig(overrides?: Partial<ProxyConfig>): ProxyConfig {
  const config: ProxyConfig = {
    // 环境变量
    apiKey: process.env[EnvVarName.API_KEY] || '',
    mcpServerUrl: process.env[EnvVarName.SERVER_URL] || DefaultConfig.SERVER_URL,
    timeout: parseNumber(process.env[EnvVarName.TIMEOUT], DefaultConfig.TIMEOUT),
    debug: parseBoolean(process.env[EnvVarName.DEBUG], DefaultConfig.DEBUG),
  };

  // 应用覆盖配置
  if (overrides) {
    if (overrides.apiKey) {
      config.apiKey = overrides.apiKey;
    }
    if (overrides.mcpServerUrl) {
      config.mcpServerUrl = overrides.mcpServerUrl;
    }
    if (overrides.timeout !== undefined) {
      config.timeout = overrides.timeout;
    }
    if (overrides.debug !== undefined) {
      config.debug = overrides.debug;
    }
  }

  // 验证必填配置
  if (!config.apiKey) {
    throw new Error(
      `Missing required configuration: ${EnvVarName.API_KEY}. ` +
      'Please set the environment variable or pass --api-key option.'
    );
  }

  return config;
}

/**
 * 验证配置
 */
export function validateConfig(config: ProxyConfig): void {
  if (!config.apiKey) {
    throw new Error('API Key is required');
  }

  if (!config.mcpServerUrl) {
    throw new Error('MCP Server URL is required');
  }

  if (!config.mcpServerUrl.startsWith('http://') && !config.mcpServerUrl.startsWith('https://')) {
    throw new Error('MCP Server URL must start with http:// or https://');
  }

  if (config.timeout <= 0) {
    throw new Error('Timeout must be a positive number');
  }
}
