# 二、状态与配置

## 1. `useState` — 跨组件/跨请求共享状态

**用途**：服务端给每个请求一份独立状态，客户端所有组件共享同一份。比 `ref` 多一层"同 key 全局单例"，且 SSR 会序列化给客户端，避免闪烁。

**示例**：

```ts
// composables/useCart.ts
export const useCart = () => useState<number>('cart-count', () => 0)

// 任意组件里
const count = useCart()
count.value++ // 所有用到 useCart() 的组件同步更新
```

**规则**：`key` 要全局唯一；初始化函数只能同步返回。

---

## 2. `useCookie` — 响应式 Cookie

**用途**：读写 Cookie 且是响应式的（改值页面自动更新），SSR 客户端同步。常用于 token、偏好设置。

**示例**：

```ts
<script setup lang="ts">
const token = useCookie('token', {
  maxAge: 60 * 60 * 24 * 7, // 7 天
  httpOnly: false,          // 前端 JS 可读（httpOnly 的只能在服务端读）
  secure: process.env.NODE_ENV === 'production',
})

function login() { token.value = 'abc123' }
function logout() { token.value = null }
</script>
```

---

## 3. `useRuntimeConfig` — 运行时配置

**用途**：读取 `nuxt.config.ts` 里 `runtimeConfig` 的配置。**`private` 部分只在服务端可用**（如数据库密码），`public` 部分会暴露给浏览器。

**示例**（你项目的 `server/utils/db.ts` 就是这么用的）：

```ts
// nuxt.config.ts
runtimeConfig: {
  mysqlHost: process.env.MYSQL_HOST,      // 默认 private（服务端专用）
  public: {
    siteName: '我的站点',                  // public 会下发给浏览器
  },
}

// 任意前端/服务端代码里
const config = useRuntimeConfig()
console.log(config.mysqlHost)  // 服务端才有值
console.log(config.public.siteName)
```

---

## 4. `useAppConfig` — 应用级全局配置（可响应式覆盖）

**用途**：读取 `app.config.ts`，配置会同时给前后端，且**运行时可以在客户端覆盖**（不重新构建）。

**示例**：

```ts
// app.config.ts
export default defineAppConfig({
  title: '我的博客',
  theme: { primary: '#00dc82' },
})
```

```ts
// 组件里（必须在 <script setup> 中调用）
const appConfig = useAppConfig()
appConfig.title = '改了标题' // 响应式，直接生效
```

> ⚠️ 注意：`useAppConfig` 必须在 `<script setup>`（setup 上下文）中调用，普通 `<script>` 顶层调用会报 "no active nuxt app context"。
