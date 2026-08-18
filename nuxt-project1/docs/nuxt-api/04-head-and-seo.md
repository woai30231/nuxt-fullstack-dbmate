# 四、Head 与 SEO

## 1. `useHead` — 设置 `<head>` 内容

**用途**：动态设置页面 `title`、`meta`、`link`、`script` 等，SSR 时会输出到 HTML 中（利于 SEO）。

**示例**：

```ts
<script setup lang="ts">
const { data: post } = await useFetch('/api/posts/1')
useHead({
  title: () => post.value?.title || '文章',
  meta: [
    { name: 'description', content: '这是一篇关于 Nuxt 的文章' },
  ],
})
</script>
```

---

## 2. `useSeoMeta` — SEO 简写

**用途**：批量设置 SEO 相关标签（`title`、`description`、`og:*`、`twitter:*` 等）。

**示例**：

```ts
useSeoMeta({
  title: '我的首页',
  description: 'Nuxt 全栈演示项目',
  ogTitle: '我的首页',
  ogDescription: 'Nuxt 全栈演示项目',
})
```

**补充**：`useServerSeoMeta` 只会在服务端输出这些标签，客户端不再处理，适合纯 SEO 用途。
