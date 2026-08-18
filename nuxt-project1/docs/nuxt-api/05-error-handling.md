# 五、错误处理

## 1. `createError` — 创建错误对象（前后端通用）

**用途**：创建一个结构化错误，可带 `statusCode`、`statusMessage`、`message`。服务端 `throw` 后客户端能收到对应 HTTP 状态码。

**示例**：

```ts
// 服务端接口里
throw createError({ statusCode: 404, statusMessage: '文章不存在' })

// 前端页面里
throw createError({ statusCode: 403, message: '无权访问' })
```

---

## 2. `showError` — 跳转/显示错误页

**用途**：在客户端主动把用户带到 Nuxt 错误页（`app/error.vue`）。

**示例**：

```ts
function go403() {
  showError(createError({ statusCode: 403, message: '无权访问' }))
}
```

---

## 3. `clearError` — 清除错误

**用途**：清除当前错误，可携带跳转目标。

**示例**：

```ts
clearError()                    // 清除并停留在错误页
clearError({ redirect: '/' })   // 清除并回首页
```

---

## 4. `useError` — 读取当前错误

**用途**：自定义错误页（`app/error.vue`）里读取错误信息。

**示例**：

```vue
<!-- app/error.vue -->
<script setup lang="ts">
const error = useError()
</script>

<template>
  <div>
    <h1>{{ error?.statusCode }}</h1>
    <p>{{ error?.statusMessage || error?.message }}</p>
    <button @click="clearError({ redirect: '/' })">回首页</button>
  </div>
</template>
```
