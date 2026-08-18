<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/posts')
const likedTitles = useState<string[]>('study-liked-titles', () => []);
console.log("收藏数组",likedTitles)
</script>

<template>
  <section>
    <div class="title-row">
      <h1>文章列表</h1>
      <button type="button" class="ghost" :disabled="pending" @click="refresh()">
        刷新
      </button>
    </div>
    <p class="hint">
      页面用 <code>useFetch('/api/posts')</code> 请求
      <code>server/api/posts/index.get.ts</code>。
    </p>

    <p v-if="pending" class="state">加载中…</p>
    <p v-else-if="error" class="state error">请求失败：{{ error.message }}</p>

    <ul v-else class="list">
      <li v-for="post in data?.list" :key="post.id">
        <NuxtLink :to="`/posts/${post.id}`">
          <strong>{{ post.title }}</strong>
          <span>{{ post.summary }}</span>
          <small>{{ post.author }} · {{ post.publishedAt }}</small>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.hint {
  margin: 0 0 1.25rem;
  color: #4b5563;
  line-height: 1.6;
}

code {
  padding: 0.1em 0.35em;
  background: #eef2f7;
  border-radius: 4px;
  font-size: 0.9em;
}

.ghost {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
}

.ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.state {
  color: #6b7280;
}

.state.error {
  color: #dc2626;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.list a {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
}

.list a:hover {
  border-color: #00dc82;
}

.list span {
  color: #4b5563;
  font-size: 0.95rem;
}

.list small {
  color: #9ca3af;
}
</style>
