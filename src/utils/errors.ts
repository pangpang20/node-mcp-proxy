import { JsonRpcErrorResponse, JsonRpcErrorCode, JsonRpcError } from '../types/mcp.js';

/**
 * 创建 JSON-RPC 2.0 错误响应
 */
export function createErrorResponse(
  id: string | number | null,
  code: JsonRpcErrorCode,
  message: string,
  data?: unknown
): JsonRpcErrorResponse {
  const error: JsonRpcError = {
    code,
    message,
  };

  if (data !== undefined) {
    error.data = data;
  }

  return {
    jsonrpc: '2.0',
    id: id ?? null,
    error,
  };
}

/**
 * 创建解析错误响应
 */
export function createParseError(id: string | number | null = null): JsonRpcErrorResponse {
  return createErrorResponse(id, JsonRpcErrorCode.ParseError, 'Parse error');
}

/**
 * 创建无效请求错误响应
 */
export function createInvalidRequestError(
  id: string | number | null = null,
  message: string = 'Invalid Request'
): JsonRpcErrorResponse {
  return createErrorResponse(id, JsonRpcErrorCode.InvalidRequest, message);
}

/**
 * 创建方法未找到错误响应
 */
export function createMethodNotFoundError(
  id: string | number | null,
  method?: string
): JsonRpcErrorResponse {
  return createErrorResponse(
    id,
    JsonRpcErrorCode.MethodNotFound,
    method ? `Method not found: ${method}` : 'Method not found'
  );
}

/**
 * 创建网络错误响应
 */
export function createNetworkError(
  id: string | number | null,
  message: string
): JsonRpcErrorResponse {
  return createErrorResponse(id, JsonRpcErrorCode.NetworkError, message);
}

/**
 * 创建超时错误响应
 */
export function createTimeoutError(
  id: string | number | null,
  timeoutMs: number
): JsonRpcErrorResponse {
  return createErrorResponse(
    id,
    JsonRpcErrorCode.TimeoutError,
    `Request timed out after ${timeoutMs}ms`
  );
}

/**
 * 创建认证错误响应
 */
export function createAuthenticationError(
  id: string | number | null,
  message: string = 'Authentication failed'
): JsonRpcErrorResponse {
  return createErrorResponse(id, JsonRpcErrorCode.AuthenticationError, message);
}
