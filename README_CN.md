# node-mcp-proxy

一个轻量级的 MCP（Model Context Protocol）代理服务器，使用 Node.js 和 TypeScript 构建。它可以在 stdio 和 HTTP 端点之间转发 JSON-RPC 2.0 消息。

## 功能特性

- **轻量级**: 最小依赖，仅使用 `commander` 进行 CLI 解析
- **快速**: 使用原生 Node.js fetch API（Node 20+）
- **标准兼容**: 完整的 JSON-RPC 2.0 协议支持
- **配置灵活**: 支持环境变量和命令行参数
- **调试模式**: 内置日志功能，便于排查问题

## 系统要求

- Node.js >= 20.0.0
- pnpm >= 8.x（或 npm/yarn）

## 安装

### 从 npm 安装（推荐）

```bash
npm install -g node-mcp-proxy
```

### 从源码安装

```bash
git clone git@github.com:pangpang20/node-mcp-proxy.git
cd node-mcp-proxy
pnpm install
pnpm build
```

## 使用方法

### 环境变量

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| `MCP_API_KEY` | 是 | - | 用于认证的 API Key |
| `MCP_SERVER_URL` | 否 | `https://api.mcp.aliyun.com/v1` | MCP 服务器 URL |
| `MCP_TIMEOUT` | 否 | `30000` | 请求超时时间（毫秒） |
| `MCP_DEBUG` | 否 | `false` | 启用调试日志 |

### 命令行选项

```bash
node-mcp-proxy --help

Options:
  -V, --version        输出版本号
  -u, --url <url>      MCP 服务器 URL
  -k, --api-key <key>  认证 API Key
  -t, --timeout <ms>   请求超时时间（毫秒）
  -d, --debug          启用调试模式
  -h, --help           显示帮助信息
```

### 使用示例

#### 使用环境变量

```bash
# 设置环境变量
export MCP_API_KEY="your-api-key-here"

# 启动代理
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

#### 组合使用

```bash
MCP_API_KEY="env-key" node-mcp-proxy --url "https://api.example.com" --timeout 60000 --debug
```

## MCP 客户端配置

### Claude Desktop 配置

将以下配置添加到 Claude Desktop 配置文件中：

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

此代理支持以下 MCP 方法：

| 方法 | 说明 |
|------|------|
| `initialize` | 初始化 MCP 连接 |
| `ping` | 心跳检测 |
| `tools/list` | 列出可用工具 |
| `tools/call` | 调用工具 |
| `resources/list` | 列出可用资源 |
| `resources/read` | 读取资源 |
| `prompts/list` | 列出可用提示词 |
| `prompts/get` | 获取提示词 |

## JSON-RPC 2.0 错误码

| 错误码 | 消息 | 说明 |
|--------|------|------|
| -32700 | Parse error | 收到无效的 JSON |
| -32600 | Invalid Request | JSON 不是有效的请求对象 |
| -32601 | Method not found | 方法不存在 |
| -32602 | Invalid params | 方法参数无效 |
| -32603 | Internal error | 内部 JSON-RPC 错误 |
| -32001 | Network error | 转发请求时网络错误 |
| -32002 | Timeout error | 请求超时 |
| -32003 | Authentication error | 认证失败 |

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test

# 运行测试（监听模式）
pnpm test:watch

# 代码检查
pnpm lint
```

## 构建产物

执行 `pnpm build` 后，会在 `dist` 目录生成以下文件：

```
dist/
├── index.js          # CommonJS 版本
├── index.mjs         # ESM 版本
├── index.d.ts        # 类型声明文件
└── *.map             # Source maps
```

## 常见问题

### "Missing required configuration: MCP_API_KEY"

确保已设置 `MCP_API_KEY` 环境变量或传递了 `--api-key` 命令行参数。

### "Request timed out"

使用 `MCP_TIMEOUT` 环境变量或 `--timeout` 命令行参数增加超时时间。

### Connection refused

检查 MCP 服务器 URL 是否正确，以及网络是否可访问。

### 如何在 Cline/Roo Code 中使用？

1. 安装 Cline 或 Roo Code 扩展
2. 在扩展设置中找到 MCP Servers 配置
3. 添加上述配置示例
4. 确保已设置正确的 API Key

## 项目结构

```
node-mcp-proxy/
├── src/
│   ├── types/           # TypeScript 类型定义
│   │   ├── mcp.ts       # JSON-RPC 2.0 和 MCP 协议类型
│   │   └── config.ts    # 配置相关类型
│   ├── core/            # 核心功能模块
│   │   ├── stdio-handler.ts   # stdio 处理
│   │   ├── http-client.ts     # HTTP 客户端
│   │   └── message-router.ts  # 消息路由
│   ├── utils/           # 工具模块
│   │   ├── logger.ts    # 日志工具
│   │   ├── config.ts    # 配置加载
│   │   └── errors.ts    # 错误处理
│   ├── cli.ts           # 命令行参数解析
│   └── index.ts         # 程序入口
├── test/                # 测试文件
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request
