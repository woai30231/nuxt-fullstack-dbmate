# 八、服务端 API（Nitro）

## 1. `defineEventHandler` — 定义接口（核心）

**用途**：`server/api/**` 或 `server/routes/**` 下每个文件的默认导出。文件命名即路由。

**文件命名即路由**：

| 文件 | 请求 |
|---|---|
| `server/api/posts/index.get.ts` | `GET /api/posts` |
| `server/api/posts/index.post.ts` | `POST /api/posts` |
| `server/api/posts/[id].get.ts` | `GET /api/posts/:id` |
| `server/api/posts/[id].delete.ts` | `DELETE /api/posts/:id` |
| `server/routes/sitemap.xml.ts` | `GET /sitemap.xml` |

**示例**（你项目现有的 `server/api/posts/index.get.ts`）：

```ts
export default defineEventHandler(async (event) => {
  const db = useMysql() // server/utils/db.ts 自动导入
  const [rows] = await db.query(`SELECT * FROM posts ORDER BY id ASC`)
  return { list: rows, total: rows.length }
})
```

---

## 2. `getQuery` — 读查询参数

**示例**：

```ts
// GET /api/posts?page=2&size=10
export default defineEventHandler((event) => {
  const { page = 1, size = 10 } = getQuery(event)
  return { page, size }
})
```

---

## 3. `getRouterParams` — 读路径参数

**示例**：

```ts
// server/api/posts/[id].get.ts
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const db = useMysql()
  const [rows] = await db.query(`SELECT * FROM posts WHERE id = ?`, [id])
  if (!rows[0]) throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  return rows[0]
})
```

---

## 4. `readBody` — 读请求体

**示例**：

```ts
// server/api/posts/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { title, content, author }
  const db = useMysql()
  const [result] = await db.execute(
    `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`,
    [body.title, body.content, body.author],
  )
  return { id: result.insertId }
})
```

---

## 5. `getCookie` / `setCookie` — 服务端 Cookie

**示例**：

```ts
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const old = getCookie(event, 'token')
  setCookie(event, 'token', 'new-token', {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  return { ok: true }
})
```

---

## 6. `sendRedirect` — 服务端跳转

**示例**：

```ts
export default defineEventHandler((event) => {
  return sendRedirect(event, '/login', 302)
})
```

---

## 7. `defineCachedEventHandler` — 接口缓存

**用途**：接口结果缓存 N 秒，降低数据库压力。`swr: true` 表示过期后后台异步重建，用户不等待。

**示例**：

```ts
// server/api/posts/index.get.ts —— 60 秒缓存
export default defineCachedEventHandler(async (event) => {
  const db = useMysql()
  const [rows] = await db.query(`SELECT * FROM posts`)
  return { list: rows }
}, {
  maxAge: 60,
  swr: true,
  getKey: (event) => getQuery(event).page || '1', // 按参数分缓存
})
```

---

## 8. `useSession` — 会话管理（Nuxt 4 新特性）

**用途**：基于签名 Cookie 的无状态会话，存登录态/购物车等。

**示例**：

```ts
// server/api/session.get.ts
export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: '至少32个字符的随机密钥',
    cookie: { httpOnly: true },
  })
  await session.update({ userId: 1, role: 'admin' }) // 写入
  return session.data // 读取
})
```

---

## 补充：`server/utils` 自动导入

`server/utils/` 下的导出**无需 import 直接可用**（服务端所有文件里），你项目的 `useMysql`、`logger` 就是这么用的：

```ts
// server/utils/db.ts —— 你项目现有的
import mysql from 'mysql2/promise'
let pool: mysql.Pool | null = null
export function useMysql() {
  if (!pool) {
    const config = useRuntimeConfig() // 读 nuxt.config 的 runtimeConfig
    pool = mysql.createPool({
      host: config.mysqlHost,
      port: Number(config.mysqlPort || 3306),
      user: config.mysqlUser,
      password: config.mysqlPassword,
      database: config.mysqlDatabase,
    })
  }
  return pool
}
```
