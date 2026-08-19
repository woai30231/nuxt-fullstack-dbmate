# 本地 HTTPS 开发环境搭建指南

本文档介绍如何使用 mkcert 为本地开发环境签发受信任的 HTTPS 证书，使 `npm run dev` 以 `https://localhost:3000` 启动。

> 每位开发者需要在自己的电脑上独立完成以下步骤（证书不共享，也不提交到仓库）。

## 背景原理（简述）

- HTTPS = HTTP + TLS 加密。证书是服务器的"数字身份证"，用于证明身份并协商加密密钥。
- 浏览器只信任由 CA（证书颁发机构）签发的证书。mkcert 会在本机创建一个本地 CA，并将其公钥安装到系统和浏览器的信任库中。
- 因此 mkcert 签发的 `localhost` 证书在本机浏览器中显示为绿锁，而非"不受信任"警告。

## 步骤 1：下载 mkcert

在项目根目录创建 `certs` 目录并下载 mkcert（Windows amd64 单文件版）：

```cmd
mkdir certs
cd certs
curl -L -o mkcert.exe "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-windows-amd64.exe"
```

> PowerShell 环境请使用 `curl.exe`（带 .exe 后缀，避免与内置别名冲突）。

## 步骤 2：安装本地 CA

```cmd
mkcert.exe -install
```

> PowerShell 中运行当前目录程序需加 `.\` 前缀：`.\mkcert.exe -install`

弹出 Windows 安全确认窗口时点击"是"。成功后输出 `The local CA is now installed in the system trust store!`。

## 步骤 3：签发 localhost 证书

```cmd
mkcert.exe localhost 127.0.0.1 ::1
```

成功后在 `certs` 目录生成两个文件：

| 文件 | 作用 | 保密级别 |
|---|---|---|
| `localhost+2.pem` | 证书（含公钥） | 公开 |
| `localhost+2-key.pem` | 私钥 | 绝密，禁止提交、禁止外泄 |

## 步骤 4：配置 Nuxt 开发服务器

`nuxt.config.ts` 中已配置（若重新初始化项目，需手动添加）：

```ts
devServer: {
  https: {
    key: 'certs/localhost+2-key.pem',
    cert: 'certs/localhost+2.pem'
  }
},
```

## 步骤 5：启动验证

```cmd
npm run dev
```

终端输出的访问地址应为 `https://localhost:3000`。浏览器打开后：

- 地址栏显示绿色小锁即为成功
- 点击小锁 → 证书，可看到颁发者为 `mkcert ...`、颁发给 `localhost`

## 安全须知

1. **私钥绝不提交**：`certs` 目录已加入 `.gitignore`。任何私钥（HTTPS、SSH、API Secret）都不得进入版本库。
2. **CA 私钥是命根子**：执行 `mkcert.exe -CAROOT` 可查看本地 CA 存放位置。其中的 `rootCA-key.pem` 一旦泄露，他人可伪造你浏览器信任的任何证书。
3. **证书不共享**：每位开发者自行生成，互不依赖；生产环境的正式证书单独保管在生产服务器上，同样不进仓库。

## 常见问题

**Q: 浏览器显示红色"不受信任"警告？**
A: 本地 CA 未安装成功，重新执行 `mkcert.exe -install`。

**Q: 换电脑/重装系统后无法启动 HTTPS？**
A: 证书是本地生成的，按本文档步骤 1~3 重新走一遍即可（约 2 分钟）。

**Q: 想切换回 HTTP 开发？**
A: 临时注释掉 `nuxt.config.ts` 中的 `devServer.https` 配置即可。

**Q: 生产环境也用 mkcert 吗？**
A: 否。生产环境需向公共 CA（如 Let's Encrypt、DigiCert）申请对应真实域名的证书，mkcert 仅用于本地开发。
