<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/users')
</script>

<template>
  <section>
    <div class="title-row">
      <h1>用户列表</h1>
      <button type="button" class="ghost" :disabled="pending" @click="refresh()">
        刷新
      </button>
    </div>
    <p class="hint">
      接口故意延迟 400ms，刷新时可看到「加载中」。对应
      <code>server/api/users/index.get.ts</code>。
    </p>

    <p v-if="pending" class="state">加载中…</p>
    <p v-else-if="error" class="state error">请求失败：{{ error.message }}</p>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>城市</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in data?.list" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.city }}</td>
          </tr>
        </tbody>
      </table>
      <p class="total">共 {{ data?.total }} 人</p>
    </div>
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

.table-wrap {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
}

tr:last-child td {
  border-bottom: none;
}

.total {
  margin: 0;
  padding: 0.75rem 1rem;
  color: #9ca3af;
  font-size: 0.9rem;
  border-top: 1px solid #f3f4f6;
}
</style>
