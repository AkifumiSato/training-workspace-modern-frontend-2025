# Training workspace modern frontend(2025)

## Dependencies

以下のNode.jsとpnpmを前提としています。

- Node.js 22.x
- pnpm 10.1.8

### Install Node.js and pnpm by nvm

以下は、[nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)を使ってNode.jsとpnpmをインストールする手順です。

```shell-session
$ nvm install 22.x.x
$ nvm use 22.x.x
$ nvm alias default 22.x.x
$ node --version
v22.x.x
$ npm i -g pnpm@10.1.8
$ pnpm --version
10.1.8
```

## Clone & Install

```shell-session
$ git clone https://github.com/AkifumiSato/workspace-of-modern-frontend-training-2025.git
$ cd workspace-of-modern-frontend-training-2025
$ pnpm i
# Biomeによるコードチェックで動作テスト
$ pnpm check
```
