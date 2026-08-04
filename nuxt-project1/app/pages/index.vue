<template>
  <section>
    <h1>首页</h1>
    <p>这是 <code>app/pages/index.vue</code>，对应路由 <code>/</code>。</p>
    <p>点击顶部「关于」可跳转到另一个页面，体验 Nuxt 的文件路由。</p>
    <NuxtLink class="btn" to="/about">去关于页 →</NuxtLink>
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
  background: #00dc82;
  color: #003820;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.btn:hover {
  filter: brightness(0.95);
}
</style>
