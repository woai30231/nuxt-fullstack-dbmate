<script setup lang="ts">
const token = useCookie('token')
const $api = useApi()

interface MeResponse {
  user: {
    id: number
    username: string
    nickname: string | null
    avatar: string | null
    role: string
  } | null
}

// 已登录才请求当前用户信息（useApi 会自动附加 Authorization: Bearer <token> 请求头）
const me = ref<MeResponse | null>(null)
onMounted(async () => {
  if (!token.value) return
  try {
    me.value = await $api<MeResponse>('/api/auth/me')
  } catch {
    me.value = null
  }
})

async function handleLogout() {
  try {
    await $api('/api/auth/logout', { method: 'POST' })
  } finally {
    token.value = null // 清除本地 token
    await navigateTo('/login')
  }
}
</script>

<template>
  <div class="layout">
    <header class="header">
      <strong class="brand">Nuxt 入门</strong>
      <nav class="nav">
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/posts">文章</NuxtLink>
        <NuxtLink to="/products">商品</NuxtLink>
        <NuxtLink to="/users">用户</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
      </nav>
      <div class="user">
        <template v-if="me?.user">
          <span class="name">{{ me.user.nickname || me.user.username }}</span>
          <button type="button" class="logout" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <NuxtLink to="/login">登录</NuxtLink>
          <NuxtLink to="/register">注册</NuxtLink>
        </template>
      </div>
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  background: #f7f8fa;
  color: #1a1a1a;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.brand {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem 1.25rem;
}

.nav a {
  color: #4b5563;
  text-decoration: none;
}

.nav a:hover,
.nav a.router-link-active {
  color: #00dc82;
  font-weight: 600;
}

.user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.user a {
  color: #4b5563;
  text-decoration: none;
}

.user a:hover {
  color: #00dc82;
}

.name {
  font-weight: 600;
  color: #111827;
}

.logout {
  padding: 0.35rem 0.8rem;
  background: #fff;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}

.logout:hover {
  background: #fef2f2;
}

.main {
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
</style>
