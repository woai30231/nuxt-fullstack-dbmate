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

.main {
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
</style>
