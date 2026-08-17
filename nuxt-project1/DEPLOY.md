# Nuxt 项目部署指南（nuxt-project1）

> 适用项目：Nuxt 4 + Vue 3 + MySQL（`mysql2`），含服务端 API（`server/api`）与数据库迁移（dbmate）。

---

## 1. 部署方式说明（先读这一节）

本项目配置为 `ssr: false`（浏览器端渲染），**但构建产物 `.output` 中仍然包含 Nitro 服务端**：

- 它负责托管前端静态资源；
- 它负责运行 `server/api/*` 接口；
- 这些接口通过 `mysql2` 连接 MySQL 数据库。

因此，**本项目不能只把静态文件扔到 CDN / 对象存储上**，必须采用 **Node.js 服务器模式**部署，即：

```text
nuxt build  →  生成 .output/  →  node .output/server/index.mjs 启动服务
```

整个链路是：`Nginx（可选）→ Node 服务（Nitro，端口 3000）→ MySQL`。

---

## 2. 环境要求

| 组件 | 要求 |
|------|------|
| Node.js | **22.x 或更高**（推荐 Active LTS，偶数版本号，如 22.x / 24.x） |
| 包管理器 | npm（Node 自带） |
| MySQL | 5.7+ / 8.x，建议 8.x |
| 进程管理 | pm2（推荐）或 systemd（Linux） |
| Web 服务器 | Nginx（可选，用于反向代理 / HTTPS / 绑定 80 端口） |

检查本机版本：

```bash
node -v        # 必须 >= 22
npm -v
mysql --version
```

---

## 3. 部署流程总览

```text
① 准备服务器（安装 Node / MySQL）    ② 上传或拉取代码
③ 安装依赖（npm install）           ④ 配置 .env
⑤ 初始化数据库（dbmate up）         ⑥ 构建（npm run build）
⑦ 启动服务（pm2 / systemd）         ⑧ 配置 Nginx + HTTPS（可选）
```

---

## 4. 详细步骤

### 4.1 准备服务器

安装 Node.js 22+ 与 MySQL，并保证 MySQL 允许应用所在主机访问（`GRANT` 授权）。

以 Ubuntu 示例安装 Node 22：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

> Windows Server 请从官网下载 Node LTS 安装包：https://nodejs.org/

### 4.2 获取代码

```bash
# 把项目上传到服务器，或直接 clone
git clone <你的仓库地址> nuxt-project1
cd nuxt-project1
```

### 4.3 安装依赖

```bash
npm install
```

> `postinstall` 会自动执行 `nuxt prepare`，无需额外操作。

### 4.4 配置环境变量

项目运行时需要读取以下环境变量（`nuxt.config.ts` 中 `runtimeConfig` 定义）：

| 变量 | 说明 | 示例 |
|------|------|------|
| `MYSQL_HOST` | 数据库地址 | `127.0.0.1` |
| `MYSQL_PORT` | 数据库端口 | `3306` |
| `MYSQL_USER` | 数据库用户 | `app_user` |
| `MYSQL_PASSWORD` | 数据库密码 | `你的强密码` |
| `MYSQL_DATABASE` | 数据库名 | `nuxt_demo` |
| `DATABASE_URL` | 仅供 dbmate 使用 | `mysql://user:pass@host:3306/nuxt_demo` |

在项目根目录创建 `.env` 文件（**不要提交到 Git**，本项目 `.gitignore` 已忽略）：

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=app_user
MYSQL_PASSWORD=生产环境密码
MYSQL_DATABASE=nuxt_demo
DATABASE_URL="mysql://app_user:生产环境密码@127.0.0.1:3306/nuxt_demo"
```

> **重要**：生产环境请为 MySQL 创建独立账号并设置强密码，不要使用 root。

### 4.5 初始化数据库

dbmate 会根据 `DATABASE_URL` 连接数据库并执行 `db/migrations/*.sql`：

```bash
npx dbmate up
npx dbmate status    # 确认全部已执行（applied）
```

> `dbmate up` 会自动创建数据库（若不存在）。表结构由迁移文件管理，**不要手动建表**。
>
> 如需导入演示数据（`db/seeds/*.sql`，可选）：
>
> ```bash
> mysql -u app_user -p --default-character-set=utf8mb4 nuxt_demo < db/seeds/001_seed_posts.sql
> ```

### 4.6 构建项目

```bash
npm run build
```

构建成功后会在项目根目录生成 `.output/`，内容即部署产物。

> 说明：Nuxt 在 `build` 时会读取项目根目录的 `.env` 并注入 `runtimeConfig`。因此**在服务器上构建**是让 `.env` 生效的最简单方式。

### 4.7 启动服务（推荐 pm2）

#### 方式 A：pm2（推荐，支持开机自启 / 自动重启）

```bash
# 安装 pm2（全局）
npm install -g pm2

# 启动
pm2 start .output/server/index.mjs --name nuxt-project1

# 保存进程列表 + 生成开机自启脚本（Linux）
pm2 save
pm2 startup
```

常用管理命令：

```bash
pm2 list                     # 查看进程
pm2 logs nuxt-project1       # 查看日志
pm2 restart nuxt-project1    # 重启
pm2 reload nuxt-project1     # 平滑重载
pm2 stop nuxt-project1       # 停止
```

#### 方式 B：systemd（Linux）

创建服务文件 `/etc/systemd/system/nuxt-project1.service`：

```ini
[Unit]
Description=Nuxt Project 1
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nuxt-project1
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

然后：

```bash
sudo systemctl daemon-reload
sudo systemctl enable nuxt-project1
sudo systemctl start nuxt-project1
sudo systemctl status nuxt-project1
```

#### 方式 C：直接前台启动（临时测试）

```bash
node .output/server/index.mjs
```

默认监听 `3000` 端口，验证：`curl http://127.0.0.1:3000`。

> 如需改端口，启动时指定环境变量：`PORT=8080 node .output/server/index.mjs`。

### 4.8 Nginx 反向代理 + HTTPS（可选）

本项目的服务运行在 `127.0.0.1:3000`，通过 Nginx 对外提供 80/443 端口。

```nginx
server {
    listen 80;
    server_name your-domain.com;   # 换成你的域名或服务器 IP

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置并重载：

```bash
sudo ln -s /etc/nginx/sites-available/nuxt-project1 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

HTTPS 推荐用 Certbot 一键签发证书：

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 5. 验证部署

部署完成后，确认以下内容：

1. `curl http://127.0.0.1:3000` 返回首页 HTML（200）；
2. 浏览器访问域名 / IP，页面可正常渲染；
3. 打开浏览器控制台 / Network，调用项目内接口（如 `/api/xxx`）返回正常数据；
4. 数据库连接正常（接口无 500）。

---

## 6. 后续更新发布

每次改完代码发布，流程如下：

```bash
cd /var/www/nuxt-project1

git pull                        # ① 拉取最新代码
npm install                     # ② 安装新依赖（如有变化）

# ③ 若有新增迁移文件，先跑数据库迁移
npx dbmate up

npm run build                   # ④ 重新构建
pm2 restart nuxt-project1       # ⑤ 重启服务
```

> 约定：**已执行过的迁移文件不要改内容**，有变更一律新增下一个迁移文件（参见 `db/dbmate-guide.md`）。

---

## 7. 常见问题排查

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 首页 502 / 无法访问 | Node 服务未启动或已崩溃 | `pm2 list` / `systemctl status`，看日志 |
| 接口 500，日志报数据库错误 | MySQL 连接信息错误 / 未授权 / 库不存在 | 检查 `.env` 的 `MYSQL_*`、MySQL 授权、`npx dbmate up` |
| `npx dbmate up` 报 `Unknown database` | 连接串或账号错误 | 检查 `DATABASE_URL`；`dbmate up` 会自动建库 |
| 接口返回数据乱码 | 字符集不一致 | 建库 / 表使用 `utf8mb4`；导入 seeds 加 `--default-character-set=utf8mb4` |
| 修改 `.env` 后不生效 | 运行时环境变量未注入 | 方式一：在服务器上重新 `npm run build`；方式二：启动前通过 `NUXT_` 前缀环境变量注入，如 `NUXT_MYSQL_HOST=...` |
| 内存占用高 / 频繁重启 | 服务器配置低 | 参考 Nitro 文档调整；或扩容 / 升级配置 |

---

## 8. 命令速查

```bash
npm install                # 安装依赖
npx dbmate up              # 执行数据库迁移
npx dbmate status          # 查看迁移状态
npm run build              # 构建产物到 .output/
node .output/server/index.mjs   # 启动生产服务（前台）
pm2 start .output/server/index.mjs --name nuxt-project1   # pm2 启动
pm2 save && pm2 startup    # pm2 保存 + 开机自启
```

---

## 9. 安全检查清单

- [ ] `.env` 未提交到 Git（本项目 `.gitignore` 已忽略）
- [ ] 数据库使用独立账号 + 强密码，不用 root
- [ ] MySQL 端口仅对应用服务器开放（必要时限制防火墙）
- [ ] Nginx 已开启 HTTPS（生产环境强烈建议）
- [ ] pm2 已配置开机自启（`pm2 save && pm2 startup`）
- [ ] 定期备份数据库（`mysqldump` 或云厂商备份）
