# dbmate 工作原理与使用说明

> 本文结合本项目（Nuxt + MySQL + `db/migrations`）整理，便于后期复习。  
> 官方文档：https://github.com/amacneil/dbmate

---

## 1. dbmate 是什么

dbmate 是一个**数据库迁移工具**，核心能力是：

1. 用 Git 管理手写的 `.sql` 迁移文件  
2. **按版本号顺序**执行尚未跑过的脚本  
3. 在数据库里用**进度表**记录「已经执行过哪些版本」  
4. 避免漏跑、重复跑，方便本地 / 测试 / 生产对齐表结构  

它**不是 ORM**：不替你写业务查询。本项目的接口仍可用 `mysql2`（如 `server/utils/db.ts`）。

---

## 2. 和本项目的关系

| 路径 | 作用 |
|------|------|
| `db/migrations/*.sql` | 结构变更（建表、改表），由 dbmate 管理 |
| `db/seeds/*.sql` | 演示数据，**不归** dbmate；需手动 `mysql < ...` 导入 |
| `db/schema.sql` | `dbmate up` 后自动导出的「当前完整结构」快照 |
| `.env` 里的 `DATABASE_URL` | dbmate 连接数据库用 |
| `.env` 里的 `MYSQL_*` | Nuxt 应用（`mysql2`）连接用，可与 DATABASE_URL 指向同一库 |

典型连接串：

```env
DATABASE_URL="mysql://root:密码@127.0.0.1:3306/nuxt_demo"
```

---

## 3. 迁移文件长什么样

每个迁移文件**必须**包含两段标记：

```sql
-- migrate:up
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL
  -- ...
);

-- migrate:down
DROP TABLE IF EXISTS posts;
```

| 段落 | 何时执行 |
|------|----------|
| `-- migrate:up` | `dbmate up` / `dbmate migrate` |
| `-- migrate:down` | `dbmate rollback` / `dbmate down` |

文件名格式：`[版本号]_[描述].sql`  

本项目示例：

- `001_create_posts.sql`  
- `002_create_products.sql`  
- `003_create_users.sql`  

**版本号** = 文件名开头的数字。dbmate 只把版本号写入进度表；可以改描述文字，但不要乱改已执行过的版本号。

---

## 4. `dbmate up` 背后的工作原理

可以记成一条流水线：

```text
读取 DATABASE_URL
        ↓
连接 MySQL
        ↓
数据库不存在？ → 自动 CREATE DATABASE（up 会建库）
        ↓
确保存在进度表 schema_migrations（没有则创建）
        ↓
扫描 db/migrations/ 下所有 .sql，按版本号排序
        ↓
读取进度表：哪些版本已经 applied
        ↓
对「文件有、进度表还没有」的版本，依次：
   1. 解析该文件的 -- migrate:up 段
   2. 执行其中的 SQL
   3. 成功后把版本号 INSERT 进 schema_migrations
        ↓
导出当前库结构到 db/schema.sql（默认行为）
```

### 4.1 进度表为什么重要

进度表（通常叫 `schema_migrations`）只存版本号，例如：`001`、`002`、`003`。

| 情况 | 行为 |
|------|------|
| 首次 `up` | 三个文件都未记录 → 按序全部执行并打卡 |
| 再执行一次 `up` | 进度表已有记录 → 跳过，几乎无操作 |
| 新增 `004_xxx.sql` 后再 `up` | 只执行 `004`，并写入新记录 |

这就是「按序 + 不重复」的原理：**文件是说明书，进度表是打卡表。**

### 4.2 Git 和 dbmate 各自干什么

| 角色 | 负责 |
|------|------|
| Git | 把迁移 SQL 同步到各环境（版本管理） |
| dbmate | 在**当前环境的库**上决定执行哪几步 |

各环境数据库是独立的，各自有自己的进度表。测试库跑过的，不会自动出现在你电脑里；要在本机再执行一次 `dbmate up`。

### 4.3 `up` 和 `migrate` 的区别

| 命令 | 行为 |
|------|------|
| `dbmate up` | 没有库就先建库 → 跑未执行迁移 → 更新 schema 快照 |
| `dbmate migrate` | 假定库已存在 → 只跑未执行迁移 |

刚 `drop` 过库时，用 `up`；库已存在只想补迁移时，两者通常都可以，习惯上开发常用 `up`。

---

## 5. 其它常用命令的原理

| 命令 | 原理简述 |
|------|----------|
| `dbmate status` | 对比「迁移文件列表」和「进度表」，显示 applied / pending。**库必须已存在**，否则会报 Unknown database |
| `dbmate drop` | 删除整个数据库（含所有表和进度表），回到「没有这个库」 |
| `dbmate create` | 只建库，不跑迁移 |
| `dbmate rollback`（或 `down`） | 取进度表里最近一个版本 → 执行对应文件的 `migrate:down` → 删除该版本记录 |
| `dbmate new 名字` | 生成带时间戳版本号的空迁移模板（含 up/down 标记） |
| `dbmate dump` | 把当前库结构导出为 `db/schema.sql` |
| `dbmate wait` | 轮询等待数据库可连接（适合 Docker 刚启动时） |

### 注意：`drop` 之后不要立刻 `status`

`drop` 删库后，`status` 需要连库看进度，会报 `Unknown database`。正确顺序是：

```text
dbmate drop  →  dbmate up  →  dbmate status
```

---

## 6. 推荐操作流程（本项目）

### 6.1 本地从零对齐结构

```bat
cd /d E:\nuxtjs-test\nuxt-project1

npx dbmate drop
npx dbmate up
npx dbmate status
```

### 6.2 导入演示数据（可选，非 dbmate）

```bat
mysql -u root -p --default-character-set=utf8mb4 nuxt_demo < db/seeds/001_seed_posts.sql
mysql -u root -p --default-character-set=utf8mb4 nuxt_demo < db/seeds/002_seed_products.sql
mysql -u root -p --default-character-set=utf8mb4 nuxt_demo < db/seeds/003_seed_users.sql
mysql -u root -p --default-character-set=utf8mb4 nuxt_demo < db/seeds/004_seed_diaries.sql
```

Windows 下带中文的 SQL，建议加上 `--default-character-set=utf8mb4`。

### 6.3 以后改表

1. `npx dbmate new add_xxx`（或手写新编号文件，含 up/down）  
2. 只写**增量**变更，不要改已经执行过的旧文件  
3. `git add` + `git commit` + `git push`  
4. 各环境拉代码后执行：`npx dbmate up`

### 6.4 其它环境部署结构

1. 配置该环境的 `DATABASE_URL`  
2. 进入项目目录  
3. `npx dbmate up`  

工具会自动只跑该环境尚未执行的版本。

---

## 7. 重要约定（务必记住）

1. **已在某环境执行过的迁移文件，不要改内容**；有变更就新增下一个文件。  
2. **迁移管结构，种子管数据**；生产环境是否跑 seeds 要单独决策。  
3. **各环境库独立**；对齐靠「同一份迁移文件 + 各自执行 up」。  
4. 文件多了以后可以打**基线（baseline）**收拢历史；那是进阶话题，日常先坚持增量即可。  
5. `.env` 含密码，**不要提交到 Git**（本项目 `.gitignore` 已忽略）。

---

## 8. 一句话总结

> **Git 同步 SQL 说明书；dbmate up 对照进度表，按序执行还没打卡的 `migrate:up`，并记录版本。**

`dbmate` 解决的是「多环境表结构如何可靠对齐」；业务里的 `SELECT` / `INSERT` 仍由你的 Nuxt `server/api` + `mysql2` 完成。

---

## 9. 速查命令

```bat
npx dbmate --help
npx dbmate status
npx dbmate up
npx dbmate migrate
npx dbmate rollback
npx dbmate drop
npx dbmate new 迁移描述名
```

在项目根目录执行；确保已安装：`npm install --save-dev dbmate`。
