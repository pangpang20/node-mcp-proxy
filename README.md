# node-mcp-proxy

A lightweight MCP (Model Context Protocol) proxy server built with Node.js and TypeScript. It forwards JSON-RPC 2.0 messages between stdio and HTTP endpoints.

## Features

- **Lightweight**: Minimal dependencies, only uses `commander` for CLI parsing
- **Fast**: Built with native Node.js fetch API (Node 20+)
- **Standards Compliant**: Full JSON-RPC 2.0 protocol support
- **Easy Configuration**: Support both environment variables and command-line arguments
- **Debug Mode**: Built-in logging for troubleshooting

## Requirements

- Node.js >= 20.0.0
- pnpm >= 8.x (or npm/yarn)

## Installation

### From npm (recommended)

```bash
npm install -g node-mcp-proxy
```

### From source

```bash
git clone https://github.com/pangpang20/node-mcp-proxy.git
cd node-mcp-proxy
pnpm install
pnpm build
```

## Usage

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MCP_API_KEY` | Yes | - | API key for authentication |
| `MCP_SERVER_URL` | No | `https://api.mcp.aliyun.com/v1` | MCP server URL |
| `MCP_TIMEOUT` | No | `30000` | Request timeout in milliseconds |
| `MCP_DEBUG` | No | `false` | Enable debug logging |

### Command Line Options

```bash
node-mcp-proxy --help

Options:
  -V, --version        output the version number
  -u, --url <url>      MCP server URL
  -k, --api-key <key>  API key for authentication
  -t, --timeout <ms>   Request timeout in milliseconds
  -d, --debug          Enable debug mode
  -h, --help           display help for command
```

### Examples

#### Basic usage with environment variables

```bash
export MCP_API_KEY="your-api-key-here"
node-mcp-proxy
```

#### Using command-line arguments

```bash
node-mcp-proxy --api-key "your-api-key-here" --url "https://api.example.com/mcp"
```

#### With debug mode

```bash
node-mcp-proxy --api-key "your-api-key-here" --debug
```

## MCP Client Configuration

### Claude Desktop Configuration

Add the following to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aliyun-mcp": {
      "command": "node-mcp-proxy",
      "args": [],
      "env": {
        "MCP_API_KEY": "your-api-key-here",
        "MCP_SERVER_URL": "https://api.mcp.aliyun.com/v1",
        "MCP_TIMEOUT": "30000",
        "MCP_DEBUG": "false"
      }
    }
  }
}
```

### VS Code MCP Extension

If using a VS Code extension that supports MCP:

```json
{
  "mcp.servers": [
    {
      "name": "aliyun-mcp",
      "type": "stdio",
      "command": "node-mcp-proxy",
      "env": {
        "MCP_API_KEY": "your-api-key-here"
      }
    }
  ]
}
```

## Protocol Support

This proxy supports the following MCP methods:

- `initialize` - Initialize the MCP connection
- `ping` - Heartbeat check
- `tools/list` - List available tools
- `tools/call` - Call a tool
- `resources/list` - List available resources
- `resources/read` - Read a resource
- `prompts/list` - List available prompts
- `prompts/get` - Get a prompt

## JSON-RPC 2.0 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON was received |
| -32600 | Invalid Request | The JSON sent is not a valid Request object |
| -32601 | Method not found | The method does not exist |
| -32602 | Invalid params | Invalid method parameter(s) |
| -32603 | Internal error | Internal JSON-RPC error |
| -32001 | Network error | Network error while forwarding request |
| -32002 | Timeout error | Request timed out |
| -32003 | Authentication error | Authentication failed |

## Development

```bash
# Install dependencies
pnpm install

# Development mode (watch)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## Troubleshooting

### "Missing required configuration: MCP_API_KEY"

Make sure you have set the `MCP_API_KEY` environment variable or passed the `--api-key` command-line option.

### "Request timed out"

Increase the timeout value using `MCP_TIMEOUT` environment variable or `--timeout` command-line option.

### Connection refused

Verify that the MCP server URL is correct and accessible from your network.

## License

MIT
