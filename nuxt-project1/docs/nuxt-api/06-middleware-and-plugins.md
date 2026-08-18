# 六、中间件与插件

## 1. `defineNuxtRouteMiddleware` — 路由守卫

**用途**：在路由跳转前执行逻辑（鉴权、重定向、埋点）。文件放 `app/middleware/`，按文件名全局（命名 `global` 或 `middleware.global`）或按页面 `definePageMeta({ middleware })` 启用。

**示例**：

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  if (!token.value) {
    return navigateTo('/login', { query: { redirect: to.fullPath } })
  }
})
```

```ts
// app/pages/diaries/index.vue —— 按页面启用
definePageMeta({ middleware: 'auth' })
```

**常用返回**：

| 返回 | 效果 |
|---|---|
| `navigateTo('/x')` | 跳转并中断当前导航 |
| `abortNavigation('禁止访问')` | 中断导航并显示消息 |
| 无返回值 | 放行 |

---

## 2. `defineNuxtPlugin` — 全局插件

**用途**：注入全局属性、注册第三方库。`provide` 的东西通过 `useNuxtApp().$xxx` 访问。

**示例**：

```ts
// app/plugins/toast.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('toast', (msg: string) => {
    console.log(`[toast] ${msg}`)
  })
})

// 任意组件里
const { $toast } = useNuxtApp()
$toast('保存成功')
```

**补充**：

- 插件文件名后缀 `.client.ts` 只在前端运行，`.server.ts` 只在服务端运行
- 服务端插件放 `server/plugins/`（在接口请求前初始化，可做全局中间件逻辑）
