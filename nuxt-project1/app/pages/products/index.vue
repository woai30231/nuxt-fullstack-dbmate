<script setup lang="ts">
const category = ref('')

const { data, pending, error, refresh } = await useFetch('/api/products', {
  query: { category },
  watch: [category],
})
</script>

<template>
  <section>
    <div class="title-row">
      <h1>商品列表</h1>
      <button type="button" class="ghost" :disabled="pending" @click="refresh()">
        刷新
      </button>
    </div>
    <p class="hint">
      带查询参数：切换分类会请求
      <code>/api/products?category=xxx</code>。
    </p>

    <div class="filters">
      <button
        type="button"
        :class="{ active: category === '' }"
        @click="category = ''"
      >
        全部
      </button>
      <button
        v-for="item in data?.categories"
        :key="item"
        type="button"
        :class="{ active: category === item }"
        @click="category = item"
      >
        {{ item }}
      </button>
    </div>

    <p v-if="pending" class="state">加载中…</p>
    <p v-else-if="error" class="state error">请求失败：{{ error.message }}</p>

    <ul v-else class="list">
      <li v-for="product in data?.list" :key="product.id">
        <div>
          <strong>{{ product.name }}</strong>
          <span>{{ product.description }}</span>
        </div>
        <div class="right">
          <em>¥{{ product.price }}</em>
          <small>{{ product.category }} · 库存 {{ product.stock }}</small>
        </div>
      </li>
    </ul>

    <p v-if="data" class="total">共 {{ data.total }} 件</p>
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
  margin: 0 0 1rem;
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

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.filters button {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  color: #4b5563;
}

.filters button.active {
  border-color: #00dc82;
  background: #e8fff5;
  color: #003820;
  font-weight: 600;
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

.list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.list strong {
  display: block;
  margin-bottom: 0.25rem;
}

.list span {
  color: #4b5563;
  font-size: 0.95rem;
}

.right {
  text-align: right;
  white-space: nowrap;
}

.right em {
  display: block;
  font-style: normal;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.right small {
  color: #9ca3af;
}

.total {
  margin: 1rem 0 0;
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>
