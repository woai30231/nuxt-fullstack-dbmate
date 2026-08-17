<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/diaries')

const moodEmoji: Record<string, string> = {
  开心: '😄',
  平静: '😌',
  低落: '😔',
  期待: '🤩',
  兴奋: '🤗',
  焦虑: '😰',
}
</script>

<template>
  <section>
    <div class="title-row">
      <h1>小明的日记</h1>
      <button type="button" class="ghost" :disabled="pending" @click="refresh()">
        刷新
      </button>
    </div>
    <p class="hint">
      页面用 <code>useFetch('/api/diaries')</code> 请求
      <code>server/api/diaries/index.get.ts</code>。
    </p>

    <p v-if="pending" class="state">加载中…</p>
    <p v-else-if="error" class="state error">请求失败：{{ error.message }}</p>

    <ul v-else class="list">
      <li v-for="diary in data?.list" :key="diary.id" class="card">
        <div class="card-head">
          <strong>{{ diary.title }}</strong>
          <span class="meta">
            <span v-if="diary.weather" class="tag">{{ diary.weather }}</span>
            <span v-if="diary.mood" class="tag">
              {{ moodEmoji[diary.mood] || '📝' }} {{ diary.mood }}
            </span>
          </span>
        </div>
        <p class="date">{{ diary.diaryDate }} · {{ diary.author }}</p>
      </li>
    </ul>

    <p v-if="data && !pending" class="state">{{ data.total }} 篇日记</p>
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
  margin: 0 0 1rem;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.card {
  display: grid;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.card:hover {
  border-color: #00dc82;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.05rem;
}

.meta {
  display: inline-flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.tag {
  padding: 0.15rem 0.55rem;
  background: #eef2f7;
  border-radius: 999px;
  font-size: 0.8rem;
  color: #4b5563;
}

.date {
  margin: 0;
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>
