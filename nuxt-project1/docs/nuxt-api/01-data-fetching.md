# 一、数据获取（前端 `app/` 内）

## 1. `useFetch` — 最常用的 SSR 感知请求

**用途**：在页面/组件里请求接口，**服务端渲染时自动在 Node 端发请求**，并把数据序列化进 HTML（无需手动处理请求时机），客户端接管后不重复请求。数据变化可用 `refresh()` 手动重拉。

**返回**：`{ data, pending, error, refresh, status, clear }`

**示例**（改造自 `app/pages/posts/index.vue`）：

```ts
<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/posts')

// 带 query 参数：会自动拼到 URL
const { data: diary } = await useFetch('/api/diaries', {
  query: { page: 1, size: 10 },
})

// 带 body：POST 请求
const { data: created } = await useFetch('/api/posts', {
  method: 'POST',
  body: { title: '新文章' },
})
</script>

<template>
  <p v-if="pending">加载中…</p>
  <p v-else-if="error">{{ error.message }}</p>
  <ul v-else>
    <li v-for="p in data?.list" :key="p.id">{{ p.title }}</li>
  </ul>
</template>
```

**注意**：路径写**相对服务端**的 `/api/...`（SSR 时是 Node 内部请求），不要写 `http://localhost:3000/api/...`。

---

## 2. `useAsyncData` — useFetch 的底层

**用途**：当请求逻辑不是简单一个 URL（比如要先算 token、要组合多个请求）时，在 `handler` 里写任意逻辑。`key` 用于区分/复用缓存。

**返回**：同上。

**示例**：

```ts
<script setup lang="ts">
const route = useRoute()

const { data: stats } = await useAsyncData('dashboard-stats', async () => {
  const [posts, users] = await Promise.all([
    $fetch('/api/posts'),
    $fetch('/api/users'),
  ])
  return { postCount: posts.total, userCount: users.total }
}, { watch: [() => route.params.id] }) // 参数变化自动重新执行
</script>
```

**区别**：`useFetch('/api/x')` 等价于 `useAsyncData(key, () => $fetch('/api/x'))`。

---

## 3. `useLazyFetch` / `useLazyAsyncData` — 不阻塞导航

**用途**：首屏不强等数据，页面先渲染（`pending` 初始为 `true`），数据到了再更新。适合非关键内容（推荐位、侧边栏）。

**示例**：

```ts
<script setup lang="ts">
// pending 一开始就是 true，页面不会等这个请求
const { data: hotProducts, pending } = useLazyFetch('/api/products', {
  query: { sort: 'hot' },
})
</script>

<template>
  <div v-if="pending">热门商品加载中…</div>
  <ul v-else>
    <li v-for="p in hotProducts?.list" :key="p.id">{{ p.name }}</li>
  </ul>
</template>
```

---

## 4. `$fetch` — 裸请求（不感知 SSR）

**用途**：在**事件回调**（点击、表单提交、定时器）里发请求，走浏览器网络栈。SSR 阶段不要用它做首屏数据（不会进 HTML）。

**示例**：

```ts
<script setup lang="ts">
const loading = ref(false)

async function createPost() {
  loading.value = true
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: { title: '测试' },
    })
    await refreshNuxtData() // 刷新列表
  } finally {
    loading.value = false
  }
}
</script>
```
