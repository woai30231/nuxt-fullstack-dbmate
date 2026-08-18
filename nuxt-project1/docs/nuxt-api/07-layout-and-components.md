# 七、布局与组件

## 1. `NuxtLayout` / `NuxtPage` — 布局与页面出口

**用途**：`NuxtLayout` 渲染布局（`app/layouts/*.vue`，用 `<slot />` 承接内容）；`NuxtPage` 渲染当前路由匹配的页面组件。

**示例**（`app/app.vue` 已用）：

```vue
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

```vue
<!-- app/layouts/default.vue -->
<template>
  <div>
    <header>公共导航</header>
    <slot /> <!-- 页面内容在这里 -->
    <footer>公共页脚</footer>
  </div>
</template>
```

---

## 2. `NuxtLink` — 客户端路由链接

**用途**：站内跳转用 `NuxtLink` 而非 `<a>`，享受客户端路由（不刷新页面、预取）。

**示例**：

```vue
<NuxtLink to="/posts/1">文章 1</NuxtLink>
<NuxtLink :to="{ path: '/posts', query: { page: 2 } }">第 2 页</NuxtLink>
<NuxtLink to="/" external>站外链接</NuxtLink>
```

---

## 3. `<ClientOnly>` — 仅客户端渲染

**用途**：组件里用了浏览器 API（`window`/`document`）或第三方库时，避免 SSR 阶段报错。

**示例**：

```vue
<template>
  <ClientOnly>
    <MyCharts />
    <template #fallback>图表加载中…</template>
  </ClientOnly>
</template>
```

**等价判断**：`import.meta.client` / `import.meta.server` 可在 JS 里分支。
