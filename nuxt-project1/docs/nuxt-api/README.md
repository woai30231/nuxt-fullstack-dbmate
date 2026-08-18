# Nuxt 4 全栈 API 使用说明文档

> 适用项目：`nuxt-project1`（Nuxt 4.5.1，Nitro 服务端）
> 核心心智模型：**一份代码，两端运行** —— `app/` 目录的代码跑在「浏览器 + Node 服务端」，`server/` 目录的代码只跑在服务端。

## 文档索引

| 分类 | 文件 | 包含 API |
|---|---|---|
| 数据获取 | [01-data-fetching.md](./01-data-fetching.md) | `useFetch` `useAsyncData` `useLazyFetch` `$fetch` |
| 状态与配置 | [02-state-and-config.md](./02-state-and-config.md) | `useState` `useCookie` `useRuntimeConfig` `useAppConfig` |
| 路由与导航 | [03-routing-and-navigation.md](./03-routing-and-navigation.md) | `useRoute` `useRouter` `navigateTo` `definePageMeta` |
| Head 与 SEO | [04-head-and-seo.md](./04-head-and-seo.md) | `useHead` `useSeoMeta` |
| 错误处理 | [05-error-handling.md](./05-error-handling.md) | `createError` `showError` `clearError` `useError` |
| 中间件与插件 | [06-middleware-and-plugins.md](./06-middleware-and-plugins.md) | `defineNuxtRouteMiddleware` `defineNuxtPlugin` |
| 布局与组件 | [07-layout-and-components.md](./07-layout-and-components.md) | `NuxtLayout` `NuxtPage` `NuxtLink` `ClientOnly` |
| 服务端 API | [08-server-api.md](./08-server-api.md) | `defineEventHandler` `getQuery` `getRouterParams` `readBody` `getCookie` `setCookie` `sendRedirect` `defineCachedEventHandler` `useSession` |
| 工具函数 | [09-utility-functions.md](./09-utility-functions.md) | `refreshNuxtData` `clearNuxtData` `callOnce` `useRequestHeaders` `useRequestEvent` |

## 目录结构速览（Nuxt 4）

```
nuxt-project1/
├── app/            # 前端：页面/组件/布局/中间件/插件（SSR+CSR 共用）
│   ├── app.vue
│   ├── layouts/    # 布局
│   └── pages/      # 文件即路由
├── server/         # 后端：只跑在 Node 服务端（Nitro 引擎）
│   ├── api/        # /api/** 接口
│   ├── routes/     # 非 /api 的接口路由
│   ├── utils/      # 服务端工具（自动导入）
│   ├── middleware/ # 服务端中间件
│   └── plugins/    # 服务端插件
├── public/         # 静态资源
├── db/             # SQL 迁移文件（本项目自定义）
├── nuxt.config.ts  # 全局配置 + routeRules
└── app.config.ts   # 前端响应式全局配置
```

## 双端执行心法（最重要的一张表）

| 代码位置 | 执行端 |
|---|---|
| `<script setup>` 顶层 | SSR：Node 跑一次 → 浏览器 hydration 再跑一次 |
| `useFetch` / `useAsyncData` | SSR 时数据请求在 Node 完成并序列化进 HTML |
| `server/api/**` | 永远只在 Node |
| `onMounted`、`<ClientOnly>`、`import.meta.client` | 只在浏览器 |
| `import.meta.server` | 只在服务端 |

## 渲染模式速查（`nuxt.config.ts` 的 `routeRules`）

```ts
routeRules: {
  '/static/**': { prerender: true },      // 构建时生成静态 HTML
  '/app/**':    { ssr: false },           // 纯 SPA（客户端渲染）
  '/docs/**':   { swr: 3600 },            // 服务端渲染 + 缓存 1 小时
  '/old':       { redirect: '/new' },     // 301 跳转
  // 其余默认 ssr: true（服务端渲染）
}
```

> 注意：`routeRules` 的 `prerender` 只接受具体路径，含 `*` 的通配符不会触发预渲染，需配合 `nitro.prerender.routes` 显式声明。
