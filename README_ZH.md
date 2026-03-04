# node-mcp-proxy

一个轻量级的 MCP (Model Context Protocol) 代理服务器，使用 Node.js 和 TypeScript 构建。它在 stdio 和 HTTP 端点之间转发 JSON-RPC 2.0 消息。

## 功能特性

- **轻量级**：最小化依赖，仅使用 `commander` 进行 CLI 解析
- **快速**：基于原生 Node.js fetch API (Node 20+)
- **符合标准**：完全支持 JSON-RPC 2.0 协议
- **配置简单**：支持环境变量和命令行参数
- **调试模式**：内置日志系统，便于故障排查

## 系统要求

- Node.js >= 20.0.0
- pnpm >= 8.x (或 npm/yarn)

## 安装

### 从 npm 安装（推荐）

```bash
npm install -g node-mcp-proxy
```

### 从源码安装

```bash
git clone https://github.com/pangpang20/node-mcp-proxy.git
cd node-mcp-proxy
pnpm install
pnpm build
```

## 使用方法

### 环境变量

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `MCP_API_KEY` | 是 | - | API 密钥，用于身份验证 |
| `MCP_SERVER_URL` | 否 | `https://api.mcp.aliyun.com/v1` | MCP 服务器地址 |
| `MCP_TIMEOUT` | 否 | `30000` | 请求超时时间（毫秒） |
| `MCP_DEBUG` | 否 | `false` | 启用调试日志 |

### 命令行选项

```bash
node-mcp-proxy --help

选项:
  -V, --version        输出版本号
  -u, --url <url>      MCP 服务器地址
  -k, --api-key <key>  API 密钥，用于身份验证
  -t, --timeout <ms>   请求超时时间（毫秒）
  -d, --debug          启用调试模式
  -h, --help           显示帮助信息
```

### 示例

#### 使用环境变量的基本用法

```bash
export MCP_API_KEY="your-api-key-here"
node-mcp-proxy
```

#### 使用命令行参数

```bash
node-mcp-proxy --api-key "your-api-key-here" --url "https://api.example.com/mcp"
```

#### 启用调试模式

```bash
node-mcp-proxy --api-key "your-api-key-here" --debug
```

## MCP 客户端配置

### Claude Desktop 配置

将以下内容添加到 Claude Desktop 配置文件中：

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

### VS Code MCP 扩展配置

如果使用支持 MCP 的 VS Code 扩展：

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

## 协议支持

本代理支持以下 MCP 方法：

- `initialize` - 初始化 MCP 连接
- `ping` - 心跳检测
- `tools/list` - 列出可用工具
- `tools/call` - 调用工具
- `resources/list` - 列出可用资源
- `resources/read` - 读取资源
- `prompts/list` - 列出可用提示词
- `prompts/get` - 获取提示词

## JSON-RPC 2.0 错误码

| 错误码 | 错误信息 | 说明 |
|--------|----------|------|
| -32700 | 解析错误 | 接收到无效的 JSON |
| -32600 | 无效请求 | JSON 不是有效的请求对象 |
| -32601 | 方法不存在 | 方法不存在 |
| -32602 | 参数无效 | 方法参数无效 |
| -32603 | 内部错误 | 内部 JSON-RPC 错误 |
| -32001 | 网络错误 | 转发请求时发生网络错误 |
| -32002 | 超时错误 | 请求超时 |
| -32003 | 认证错误 | 身份验证失败 |

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式（监听）
pnpm dev

# 生产环境构建
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

## 故障排查

### "Missing required configuration: MCP_API_KEY"

确保已设置 `MCP_API_KEY` 环境变量或传递了 `--api-key` 命令行参数。

### "Request timed out"

使用 `MCP_TIMEOUT` 环境变量或 `--timeout` 命令行参数增加超时时间。

### 连接被拒绝

请验证 MCP 服务器地址是否正确，并确认您的网络可以访问该服务器。

## 许可证

MIT
