/**
 * JSON-RPC 2.0 错误码
 */
export enum JsonRpcErrorCode {
  // 标准 JSON-RPC 2.0 错误码
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ServerErrorStart = -32099,
  ServerErrorEnd = -32000,

  // 自定义错误码
  NetworkError = -32001,
  TimeoutError = -32002,
  AuthenticationError = -32003,
}

/**
 * JSON-RPC 2.0 请求对象
 */
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: Record<string, unknown> | unknown[];
}

/**
 * JSON-RPC 2.0 成功响应对象
 */
export interface JsonRpcSuccessResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result: unknown;
}

/**
 * JSON-RPC 2.0 错误对象
 */
export interface JsonRpcError {
  code: JsonRpcErrorCode;
  message: string;
  data?: unknown;
}

/**
 * JSON-RPC 2.0 错误响应对象
 */
export interface JsonRpcErrorResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  error: JsonRpcError;
}

/**
 * JSON-RPC 2.0 响应对象（成功或错误）
 */
export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

/**
 * MCP 协议方法名
 */
export enum McpMethod {
  Initialize = 'initialize',
  Ping = 'ping',
  ToolsList = 'tools/list',
  ToolsCall = 'tools/call',
  ResourcesList = 'resources/list',
  ResourcesRead = 'resources/read',
  PromptsList = 'prompts/list',
  PromptsGet = 'prompts/get',
}
