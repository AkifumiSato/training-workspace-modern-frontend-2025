# Storybook a11y tree MCP Server

`http://localhost:6006/iframe.html?globals=&args=&id=button--default&viewMode=story`のようなStorybook単独のURLより、アクセシビリティツリーを取得するMCPサーバーです。

このMCPサーバーは、Playwrightを使用してStorybookのiframeページにアクセスし、そのページのアクセシビリティツリーを取得します。

## Quick Start

1. MCPサーバーをbuild

```shell-session
$ pnpm build
$ npx playwright install
```

2. Cursorの_mcp.json_などでMCPサーバーを追加

```json
{
  "mcpServers": {
    "storybook-a11y-mcp": {
      "command": "node",
      "args": ["/Users/{your_repository_path}/workspace-of-modern-frontend-training-2025/packages/storybook-a11y-mcp/dist/index.js"]
    }
  }
}
```

> [!NOTE]
> nvmを使っている場合うまく動かないことがあります。その場合は`command`を`"/Users/{your_repository_path}/.nvm/versions/node/{your_node_version}/bin/node"`にしてください。

## MCP Spes

### `get_storybook_a11y_tree`

StorybookのURLからアクセシビリティツリーを取得します。

**パラメータ:**
- `url` (string, 必須): StorybookのiframeURL
  - 例: `http://localhost:6006/iframe.html?globals=&args=&id=button--default&viewMode=story`
- `timeout` (number, オプション): タイムアウト時間（ミリ秒、デフォルト: 30000）

**例:**
```json
{
  "name": "get_storybook_a11y_tree",
  "arguments": {
    "url": "http://localhost:6006/iframe.html?globals=&args=&id=button--default&viewMode=story",
    "timeout": 30000
  }
}
```

## 出力例

```
button "Submit"
  text "Submit"
```
