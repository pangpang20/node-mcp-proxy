import { describe, it, expect } from 'vitest';
import { loadConfig, validateConfig } from '../src/utils/config.js';
import { DefaultConfig } from '../src/types/config.js';

describe('Config Utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('loadConfig', () => {
    it('should load config from environment variables', () => {
      process.env.MCP_API_KEY = 'test-key';
      process.env.MCP_SERVER_URL = 'https://test.example.com';
      process.env.MCP_TIMEOUT = '60000';
      process.env.MCP_DEBUG = 'true';

      const config = loadConfig();

      expect(config.apiKey).toBe('test-key');
      expect(config.mcpServerUrl).toBe('https://test.example.com');
      expect(config.timeout).toBe(60000);
      expect(config.debug).toBe(true);
    });

    it('should use default values when environment variables are not set', () => {
      process.env.MCP_API_KEY = 'test-key';
      delete process.env.MCP_SERVER_URL;
      delete process.env.MCP_TIMEOUT;
      delete process.env.MCP_DEBUG;

      const config = loadConfig();

      expect(config.mcpServerUrl).toBe(DefaultConfig.SERVER_URL);
      expect(config.timeout).toBe(DefaultConfig.TIMEOUT);
      expect(config.debug).toBe(DefaultConfig.DEBUG);
    });

    it('should apply overrides', () => {
      process.env.MCP_API_KEY = 'env-key';

      const config = loadConfig({
        apiKey: 'override-key',
        timeout: 10000,
      });

      expect(config.apiKey).toBe('override-key');
      expect(config.timeout).toBe(10000);
    });

    it('should throw error when API key is missing', () => {
      delete process.env.MCP_API_KEY;

      expect(() => loadConfig()).toThrow('Missing required configuration');
    });
  });

  describe('validateConfig', () => {
    it('should validate a correct config', () => {
      const config = {
        apiKey: 'test-key',
        mcpServerUrl: 'https://example.com',
        timeout: 30000,
        debug: false,
      };

      expect(() => validateConfig(config)).not.toThrow();
    });

    it('should throw error when API key is empty', () => {
      const config = {
        apiKey: '',
        mcpServerUrl: 'https://example.com',
        timeout: 30000,
        debug: false,
      };

      expect(() => validateConfig(config)).toThrow('API Key is required');
    });

    it('should throw error when URL is invalid', () => {
      const config = {
        apiKey: 'test-key',
        mcpServerUrl: 'not-a-url',
        timeout: 30000,
        debug: false,
      };

      expect(() => validateConfig(config)).toThrow('must start with http:// or https://');
    });

    it('should throw error when timeout is negative', () => {
      const config = {
        apiKey: 'test-key',
        mcpServerUrl: 'https://example.com',
        timeout: -1,
        debug: false,
      };

      expect(() => validateConfig(config)).toThrow('must be a positive number');
    });
  });
});
