# 九、工具函数

## 1. `refreshNuxtData` — 刷新所有数据

**用途**：重新执行所有 `useFetch` / `useAsyncData`（保留 `key` 的缓存键）。适合"操作成功后刷新列表"。

**示例**：

```ts
// 表单提交成功后刷新列表
await $fetch('/api/posts', { method: 'POST', body })
await refreshNuxtData() // 重跑所有 useFetch / useAsyncData
```

---

## 2. `clearNuxtData` — 清除数据缓存

**用途**：清除指定（或全部）`key` 的数据缓存，下次访问时重新请求。

**示例**：

```ts
clearNuxtData()            // 全清
clearNuxtData('posts')     // 只清 key 为 posts 的
```

---

## 3. `callOnce` — 同一次渲染只执行一次

**用途**：SSR + CSR 双端执行时避免重复请求/重复初始化。

**示例**：

```ts
await callOnce('init-app', async () => {
  const config = await $fetch('/api/app-config')
  useState('app-config', () => config)
})
```

---

## 4. `useRequestHeaders` — 读 SSR 请求头

**用途**：服务端渲染阶段读取原始请求头（如 `cookie`），常用来转发给内部接口。

**示例**（转发用户 Cookie 到内部接口）：

```ts
const { data } = await useFetch('/api/user-info', {
  headers: useRequestHeaders(['cookie']),
})
```

---

## 5. `useRequestEvent` — 拿当前请求事件

**用途**：在页面/组件里获取当前服务端请求的 `H3Event`（客户端为 `null`）。

**示例**：

```ts
// 页面里（SSR 时）获取服务端请求信息
const event = useRequestEvent()
if (event) {
  console.log(getRequestURL(event).pathname) // 服务端才有值
}
```
