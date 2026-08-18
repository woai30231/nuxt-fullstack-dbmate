<template>
  <section>
    <h1>工作台(纯 SPA)</h1>
    <p>
      这个页面由 <code>routeRules: { '/app/**': { ssr: false } }</code> 配置,
      服务端完全不渲染,HTML 里只有空壳,全靠浏览器端 JS 渲染。
    </p>
    <p>当前渲染模式: <strong>{{ isCSR ? '客户端渲染(CSR)' : '正在检测…' }}</strong></p>

    <button class="btn" type="button" @click="count++">点击计数: {{ count }}</button>
    <NuxtLink class="btn ghost" to="/">← 回首页</NuxtLink>
  </section>
</template>

<script setup lang="ts">
// ssr:false 时这个值为 true;ssr:true 时服务端也为 false
const isCSR = import.meta.client
const count = ref(0)
</script>

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
  margin: 1rem 0.5rem 0 0;
  padding: 0.55rem 1rem;
  background: #111827;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn.ghost {
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.btn:hover {
  filter: brightness(1.15);
}
</style>
