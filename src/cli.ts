import { Command } from 'commander';
import { loadConfig } from './utils/config.js';
import { PROGRAM_NAME, PROGRAM_DESCRIPTION } from './constants/index.js';
import type { ProxyConfig } from './types/config.js';

export interface CliOptions {
  url?: string;
  apiKey?: string;
  timeout?: number;
  debug?: boolean;
}

/**
 * 解析命令行参数
 */
export function parseArgs(): CliOptions {
  const program = new Command();

  program
    .name(PROGRAM_NAME)
    .description(PROGRAM_DESCRIPTION)
    .version('1.0.0')
    .option('-u, --url <url>', 'MCP server URL')
    .option('-k, --api-key <key>', 'API key for authentication')
    .option('-t, --timeout <ms>', 'Request timeout in milliseconds', parseInt)
    .option('-d, --debug', 'Enable debug mode', false)
    .allowUnknownOption(false);

  program.parse(process.argv);

  return program.opts();
}

/**
 * 加载最终配置（合并命令行参数和环境变量）
 */
export function loadCliConfig(): ProxyConfig {
  const cliOptions = parseArgs();

  const overrides: Partial<ProxyConfig> = {};

  if (cliOptions.url) {
    overrides.mcpServerUrl = cliOptions.url;
  }

  if (cliOptions.apiKey) {
    overrides.apiKey = cliOptions.apiKey;
  }

  if (cliOptions.timeout !== undefined) {
    overrides.timeout = cliOptions.timeout;
  }

  if (cliOptions.debug !== undefined) {
    overrides.debug = cliOptions.debug;
  }

  return loadConfig(overrides);
}
