<template>
  <section>
    <h1>常见问题</h1>
    <p>这个页面由 <code>routeRules: { '/static/**': { prerender: true } }</code> 配置,构建时预生成为静态 HTML。</p>

    <div class="faq">
      <details v-for="item in faqs" :key="item.q">
        <summary>{{ item.q }}</summary>
        <p>{{ item.a }}</p>
      </details>
    </div>

    <NuxtLink class="btn" to="/">← 回首页</NuxtLink>
  </section>
</template>

<script setup lang="ts">
// 纯静态数据:预渲染时直接写进 HTML,不经过任何接口
const faqs = [
  { q: '预渲染和 SSR 有什么区别?', a: '预渲染在构建时就把 HTML 生成好了,访问时由静态服务器直接返回,不需要 Node 运行时;SSR 则是每次请求都实时渲染,需要后端服务在线。' },
  { q: '预渲染页面能访问数据库吗?', a: '不能。构建时服务端数据(如 useMysql)不会执行,所以这类页面只适合放内容基本不变的数据。' },
  { q: '内容更新了怎么办?', a: '重新构建一次(nuxt build)就会重新生成静态文件;也可以改用 swr 让页面定期在后台重新验证。' },
  { q: '预渲染页面还能用 JavaScript 交互吗?', a: '可以。预渲染生成的是初始 HTML,水合(hydration)后仍是完整的 Vue 应用,交互功能不受影响。' }
]
</script>

<style scoped>
h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

p {
  margin: 0 0 1rem;
  line-height: 1.6;
  color: #4b5563;
}

code {
  padding: 0.1em 0.35em;
  background: #eef2f7;
  border-radius: 4px;
  font-size: 0.9em;
}

.faq {
  display: grid;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.faq details {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
}

.faq summary {
  font-weight: 600;
  cursor: pointer;
}

.faq p {
  margin: 0.6rem 0 0;
  font-size: 0.95rem;
}

.btn {
  display: inline-block;
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
