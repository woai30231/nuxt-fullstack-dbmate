<template>
  <section>
    <h1>定价方案</h1>
    <p>预渲染页面案例:三个套餐在构建时生成,价格调整后重新构建即可。</p>

    <div class="grid">
      <div v-for="plan in plans" :key="plan.name" class="card" :class="{ featured: plan.featured }">
        <h2>{{ plan.name }}</h2>
        <p class="price">¥{{ plan.price }}<span>/月</span></p>
        <ul>
          <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
        </ul>
        <button class="btn" type="button">选择方案</button>
      </div>
    </div>

    <NuxtLink class="btn" to="/">← 回首页</NuxtLink>
  </section>
</template>

<script setup lang="ts">
const plans = [
  { name: '基础版', price: 0, featured: false, features: ['1 个站点', '10 篇日记', '社区支持'] },
  { name: '专业版', price: 29, featured: true, features: ['10 个站点', '无限日记', '邮件支持'] },
  { name: '企业版', price: 199, featured: false, features: ['不限站点', '专属客服', 'SLA 保障'] }
]
</script>

<style scoped>
h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

p {
  margin: 0 0 1.5rem;
  line-height: 1.6;
  color: #4b5563;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.card.featured {
  border: 2px solid #00dc82;
  box-shadow: 0 6px 20px rgba(0, 220, 130, 0.12);
}

.card h2 {
  margin: 0 0 0.5rem;
}

.price {
  margin: 0 0 1rem;
  font-size: 2.2rem;
  font-weight: 800;
  color: #111827;
}

.price span {
  font-size: 0.9rem;
  font-weight: 400;
  color: #6b7280;
}

ul {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: grid;
  gap: 0.4rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.btn {
  padding: 0.55rem 1.4rem;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn:hover {
  filter: brightness(1.15);
}
</style>
