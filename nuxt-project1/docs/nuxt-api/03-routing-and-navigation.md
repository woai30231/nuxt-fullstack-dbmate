# 三、路由与导航

## 1. `useRoute` — 当前路由对象

**用途**：在组件里读取当前路径、参数、query。

**示例**：

```ts
<script setup lang="ts">
const route = useRoute()

// 匹配 app/pages/posts/[id].vue
const id = route.params.id        // '1'
const page = route.query.page     // '2'
const fullPath = route.fullPath   // '/posts/1?page=2'
</script>
```

---

## 2. `useRouter` — 编程式导航

**用途**：在事件回调里跳转页面。

**示例**：

```ts
const router = useRouter()
router.push('/posts/1')
router.replace('/login')          // 不留历史
router.back()
```

---

## 3. `navigateTo` — 可在任意处调用的导航

**用途**：中间件里最常用（`return` 返回值方式），也可在普通函数里用。服务端会返回 `302` 响应。

**示例**：

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  if (!useCookie('token').value) {
    return navigateTo('/login', { redirectCode: 302 })
  }
})
```

---

## 4. `definePageMeta` — 页面元信息

**用途**：声明布局、中间件、标题、是否 keepalive 等。**只能在页面文件顶层调用**。

**示例**：

```ts
// app/pages/diaries/index.vue
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
  title: '日记列表',
  key: (route) => route.fullPath, // 同一组件按路径区分渲染
})
```
