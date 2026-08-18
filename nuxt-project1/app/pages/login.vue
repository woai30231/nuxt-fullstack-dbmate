<template>
  <section class="auth">
    <div class="card">
      <h1>登录</h1>
      <p class="hint">输入用户名和密码登录系统</p>

      <form @submit.prevent="handleSubmit">
        <label>
          <span>用户名</span>
          <input
            v-model="username"
            type="text"
            placeholder="admin"
            autocomplete="username"
            required
          />
        </label>

        <label>
          <span>密码</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••"
            autocomplete="current-password"
            required
          />
        </label>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" class="primary" :disabled="loading">
          {{ loading ? '登录中…' : '登录' }}
        </button>
      </form>

      <p class="foot">
        还没有账号？<NuxtLink to="/register">去注册</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const token = useCookie('token')

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true
  try {
    const res = await $fetch<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    // 保存 token：之后每次请求由 useApi 自动附加 Authorization: Bearer <token>
    token.value = res.token
    // 登录成功，跳回原始页面（或首页）
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/'
    await navigateTo(redirect)
  } catch (err: any) {
    console.error('登录出错:', err)
    errorMsg.value =
      err?.data?.statusMessage || err?.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
}

.hint {
  margin: 0 0 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}

form {
  display: grid;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #374151;
}

input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

input:focus {
  border-color: #00dc82;
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.15);
}

.error {
  margin: 0;
  color: #dc2626;
  font-size: 0.9rem;
}

.primary {
  padding: 0.65rem 1rem;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.primary:hover {
  background: #1f2937;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.foot {
  margin: 1.25rem 0 0;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.foot a {
  color: #00dc82;
  text-decoration: none;
  font-weight: 600;
}
</style>
