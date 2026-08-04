<template>
  <section>
    <h1>关于</h1>
    <p>这是 <code>app/pages/about.vue</code>，对应路由 <code>/about</code>。</p>
    <p>Nuxt 会根据 <code>pages</code> 目录下的文件自动生成路由，无需手写 router 配置。</p>
    <NuxtLink class="btn" to="/">← 回首页</NuxtLink>
  </section>
</template>

<style scoped>
h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

p {
  margin: 0 0 0.75rem;
  line-height: 1.6;
  color: #4b5563;
}

code {
  padding: 0.1em 0.35em;
  background: #eef2f7;
  border-radius: 4px;
  font-size: 0.9em;
}

.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.55rem 1rem;
  background: #111827;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.btn:hover {
  filter: brightness(1.15);
}
</style>
