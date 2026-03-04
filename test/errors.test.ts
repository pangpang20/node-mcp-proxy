import { describe, it, expect } from 'vitest';
import { createErrorResponse, createParseError, createInvalidRequestError } from '../src/utils/errors.js';
import { JsonRpcErrorCode } from '../src/types/mcp.js';

describe('Error Utils', () => {
  describe('createErrorResponse', () => {
    it('should create a valid error response', () => {
      const response = createErrorResponse(1, JsonRpcErrorCode.ParseError, 'Parse error');

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: JsonRpcErrorCode.ParseError,
          message: 'Parse error',
        },
      });
    });

    it('should include data when provided', () => {
      const response = createErrorResponse(1, JsonRpcErrorCode.InvalidParams, 'Invalid params', { extra: 'info' });

      expect(response.error.data).toEqual({ extra: 'info' });
    });

    it('should handle null id', () => {
      const response = createErrorResponse(null, JsonRpcErrorCode.ParseError, 'Parse error');

      expect(response.id).toBe(null);
    });
  });

  describe('createParseError', () => {
    it('should create a parse error with default null id', () => {
      const response = createParseError();

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: JsonRpcErrorCode.ParseError,
          message: 'Parse error',
        },
      });
    });

    it('should create a parse error with custom id', () => {
      const response = createParseError(123);

      expect(response.id).toBe(123);
    });
  });

  describe('createInvalidRequestError', () => {
    it('should create an invalid request error with default message', () => {
      const response = createInvalidRequestError();

      expect(response.error.message).toBe('Invalid Request');
    });

    it('should create an invalid request error with custom message', () => {
      const response = createInvalidRequestError(null, 'Custom error message');

      expect(response.error.message).toBe('Custom error message');
    });
  });
});
