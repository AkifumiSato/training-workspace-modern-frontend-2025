# Storybook MCP Server

StorybookのStoryから、アクセシビリティツリーを取得したり、スクリーンショットを撮影したりするMCPサーバーです。

## Quick Start

1. MCPサーバーをbuild

```shell-session
$ npx playwright install
$ pnpm build
```

2. Cursorの_mcp.json_などでMCPサーバーを追加

```json
{
  "mcpServers": {
    "storybook-mcp": {
      "command": "node",
      "args": ["/Users/{your_repository_path}/workspace-of-modern-frontend-training-2025/tools/storybook-mcp/dist/index.js"]
    }
  }
}
```

> [!NOTE]
> nvmを使っている場合うまく動かないことがあります。その場合は`command`を`"/Users/{user_name}/.nvm/versions/node/{your_node_version}/bin/node"`にしてください。

## MCP Specs

### `get_storybook_a11y_tree`

StorybookのStoryからアクセシビリティツリーを取得します。

**パラメータ:**
- `title` (string, 必須): Storyのタイトル
  - 例: `MyTest/SomeText`、`Button`
- `storyName` (string, 必須): Storyの名前
  - 例: `Default`、`Primary`
- `host` (string, オプション): StorybookのホストURL（デフォルト: `http://localhost:6006`）
- `timeout` (number, オプション): タイムアウト時間（ミリ秒、デフォルト: 30000）

**例:**
```json
{
  "name": "get_storybook_a11y_tree",
  "arguments": {
    "title": "Button",
    "storyName": "Default",
    "host": "http://localhost:6006",
    "timeout": 30000
  }
}
```

**出力例:**
```
button "Submit"
  text "Submit"
```

### `get_storybook_screenshot`

StorybookのStoryのスクリーンショットを撮影します。

**パラメータ:**
- `title` (string, 必須): Storyのタイトル
  - 例: `MyTest/SomeText`、`Button`
- `storyName` (string, 必須): Storyの名前
  - 例: `Default`、`Primary`
- `host` (string, オプション): StorybookのホストURL（デフォルト: `http://localhost:6006`）
- `timeout` (number, オプション): タイムアウト時間（ミリ秒、デフォルト: 30000）

**例:**
```json
{
  "name": "get_storybook_screenshot",
  "arguments": {
    "title": "Button",
    "storyName": "Default",
    "host": "http://localhost:6006",
    "timeout": 30000
  }
}
```

**出力:**
- テキスト形式でスクリーンショット撮影完了のメッセージ
- base64エンコードされたPNG形式の画像データ（フルページのスクリーンショット）
