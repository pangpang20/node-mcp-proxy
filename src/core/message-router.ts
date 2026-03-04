import {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcErrorCode,
} from '../types/mcp.js';
import { HttpClient } from './http-client.js';
import {
  createParseError,
  createInvalidRequestError,
  createNetworkError,
  createTimeoutError,
} from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * 消息路由类
 * 负责解析、验证和路由 JSON-RPC 消息
 */
export class MessageRouter {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * 处理原始消息
   */
  async handleRawMessage(rawMessage: string): Promise<JsonRpcResponse> {
    // 尝试解析 JSON
    let request: JsonRpcRequest;
    try {
      request = JSON.parse(rawMessage) as JsonRpcRequest;
    } catch (error) {
      logger.debug(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`);
      return createParseError(null);
    }

    // 验证消息格式
    const validationError = this.validateMessage(request);
    if (validationError) {
      return validationError;
    }

    // 发送请求到 MCP 服务器
    try {
      logger.debug(`Forwarding request: method=${request.method}, id=${request.id}`);
      const response = await this.httpClient.sendJsonRpc(JSON.stringify(request));
      return response as JsonRpcResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // 判断是否为超时错误
      if (errorMessage.includes('timed out')) {
        logger.warn(`Request timeout for method: ${request.method}`);
        return createTimeoutError(request.id, this.getTimeoutMs());
      }

      // 网络错误
      logger.error(`Network error: ${errorMessage}`);
      return createNetworkError(request.id, errorMessage);
    }
  }

  /**
   * 验证 JSON-RPC 2.0 消息格式
   */
  private validateMessage(request: unknown): JsonRpcResponse | null {
    if (!request || typeof request !== 'object') {
      return createInvalidRequestError(null, 'Request must be a JSON object');
    }

    const obj = request as Record<string, unknown>;

    // 验证 jsonrpc 字段
    if (obj.jsonrpc !== '2.0') {
      return createInvalidRequestError(null, 'Invalid jsonrpc version, expected "2.0"');
    }

    // 验证 method 字段
    if (typeof obj.method !== 'string') {
      return createInvalidRequestError(null, 'Missing or invalid "method" field');
    }

    // 验证 id 字段（可选，但必须是 string | number | null）
    if (obj.id !== undefined && obj.id !== null) {
      if (typeof obj.id !== 'string' && typeof obj.id !== 'number') {
        return createInvalidRequestError(null, 'Invalid "id" field, must be string, number, or null');
      }
    }

    // params 字段可选，必须是对象或数组
    if (obj.params !== undefined && obj.params !== null) {
      if (typeof obj.params !== 'object' || !Array.isArray(obj.params) && obj.params === null) {
        return createInvalidRequestError(null, 'Invalid "params" field, must be an object or array');
      }
    }

    return null;
  }

  /**
   * 获取超时时间（用于错误消息）
   */
  private getTimeoutMs(): number {
    // 这里无法直接获取配置中的 timeout，返回一个默认值
    return 30000;
  }
}
