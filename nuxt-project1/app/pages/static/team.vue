<template>
  <section>
    <h1>团队介绍</h1>
    <p>预渲染页面案例:团队成员信息在构建时写死进 HTML,适合静态托管。</p>

    <div class="grid">
      <article v-for="member in members" :key="member.name" class="card">
        <div class="avatar">{{ member.name[0] }}</div>
        <h2>{{ member.name }}</h2>
        <p class="role">{{ member.role }}</p>
        <p class="bio">{{ member.bio }}</p>
      </article>
    </div>

    <NuxtLink class="btn" to="/">← 回首页</NuxtLink>
  </section>
</template>

<script setup lang="ts">
const members = [
  { name: '小明', role: '创始人 / 全栈工程师', bio: '写日记的那种工程师。' },
  { name: '小红', role: '产品经理', bio: '负责把需求翻译成人话。' },
  { name: '小刚', role: '后端工程师', bio: 'MySQL 和 Node 的好朋友。' },
  { name: '小美', role: '前端工程师', bio: 'Vue / Nuxt 双修。' }
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.avatar {
  width: 56px;
  height: 56px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: #00dc82;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.card .role {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #00a65f;
  font-weight: 600;
}

.card .bio {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
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
