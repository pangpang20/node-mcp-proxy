import { ProxyConfig } from '../types/config.js';

/**
 * HTTP 客户端类
 * 负责发送 HTTP 请求到 MCP 服务器
 */
export class HttpClient {
  private config: ProxyConfig;

  constructor(config: ProxyConfig) {
    this.config = config;
  }

  /**
   * 发送 HTTP POST 请求
   */
  async sendRequest(body: string, signal?: AbortSignal): Promise<Response> {
    const { mcpServerUrl, apiKey, timeout } = this.config;

    // 创建超时控制
    const controller = new AbortController();

    // 如果传入了 signal，需要同时监听两个 signal
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // 如果外部 signal 被触发，也取消请求
    signal?.addEventListener('abort', () => {
      controller.abort();
      clearTimeout(timeoutId);
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(mcpServerUrl, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timed out after ${timeout}ms`);
        }
      }

      throw error;
    }
  }

  /**
   * 发送 JSON-RPC 请求并返回解析后的响应
   */
  async sendJsonRpc(jsonRpcMessage: string): Promise<unknown> {
    const response = await this.sendRequest(jsonRpcMessage);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }
}
