<template>
  <section>
    <h1>首页</h1>
    <p>下面是几个接口请求示例，数据来自本项目的 <code>server/api</code>。</p>

    <ul class="cards">
      <li>
        <NuxtLink to="/posts">
          <strong>文章列表</strong>
          <span>useFetch 拉列表，再进详情页</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/products">
          <strong>商品列表</strong>
          <span>带分类查询参数的动态请求</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/users">
          <strong>用户列表</strong>
          <span>表格展示 + 模拟加载延迟</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/diaries">
          <strong>小明的日记</strong>
          <span>日记列表，按写作日期倒序展示</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/contact">
          <strong>联系我们</strong>
          <span>获取联系信息</span>
        </NuxtLink>
      </li>
    </ul>

    <h2>混合渲染演示</h2>
    <ul class="cards">
      <li>
        <NuxtLink to="/static/faq">
          <strong>常见问题(预渲染)</strong>
          <span>prerender: 构建时生成静态 HTML</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/static/team">
          <strong>团队介绍(预渲染)</strong>
          <span>prerender: 纯静态内容</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/static/pricing">
          <strong>定价方案(预渲染)</strong>
          <span>prerender: 静态定价卡片</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/app/dashboard">
          <strong>工作台(纯 SPA)</strong>
          <span>ssr: false, 客户端渲染</span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

h2 {
  margin: 2rem 0 0.75rem;
  font-size: 1.4rem;
}

p {
  margin: 0 0 1.5rem;
  line-height: 1.6;
  color: #4b5563;
}

code {
  padding: 0.1em 0.35em;
  background: #eef2f7;
  border-radius: 4px;
  font-size: 0.9em;
}

.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.cards a {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
}

.cards a:hover {
  border-color: #00dc82;
}

.cards span {
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
