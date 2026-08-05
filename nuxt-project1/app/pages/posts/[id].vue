<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: post, pending, error } = await useFetch(() => `/api/posts/${id.value}`)
</script>

<template>
  <section>
    <NuxtLink class="back" to="/posts">← 返回列表</NuxtLink>

    <p v-if="pending" class="state">加载中…</p>
    <p v-else-if="error" class="state error">{{ error.statusMessage || error.message }}</p>

    <article v-else-if="post">
      <h1>{{ post.title }}</h1>
      <p class="meta">{{ post.author }} · {{ post.publishedAt }}</p>
      <p class="content">{{ post.content }}</p>
      <p class="hint">
        详情页请求 <code>/api/posts/{{ id }}</code>，对应
        <code>server/api/posts/[id].get.ts</code>。
      </p>
    </article>
  </section>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 1.25rem;
  color: #4b5563;
  text-decoration: none;
}

.back:hover {
  color: #00dc82;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.meta {
  margin: 0 0 1.25rem;
  color: #9ca3af;
}

.content {
  margin: 0 0 1.5rem;
  line-height: 1.7;
  color: #374151;
}

.hint {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.95rem;
}

code {
  padding: 0.1em 0.35em;
  background: #eef2f7;
  border-radius: 4px;
  font-size: 0.9em;
}

.state {
  color: #6b7280;
}

.state.error {
  color: #dc2626;
}
</style>
