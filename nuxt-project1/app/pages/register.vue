<template>
  <section class="auth">
    <div class="card">
      <h1>注册</h1>
      <p class="hint">创建新账号，密码使用 bcrypt 加密存储</p>

      <form @submit.prevent="handleSubmit">
        <label>
          <span>用户名（3~20 个字符）</span>
          <input
            v-model="username"
            type="text"
            placeholder="zhangsan"
            autocomplete="username"
            required
          />
        </label>

        <label>
          <span>邮箱</span>
          <input v-model="email" type="email" placeholder="you@example.com" required />
        </label>

        <label>
          <span>昵称（可选）</span>
          <input v-model="nickname" type="text" placeholder="张三" />
        </label>

        <label>
          <span>密码（至少 6 位）</span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••"
            autocomplete="new-password"
            required
          />
        </label>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" class="primary" :disabled="loading">
          {{ loading ? '注册中…' : '注册' }}
        </button>
      </form>

      <p class="foot">
        已有账号？<NuxtLink to="/login">去登录</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const username = ref('')
const email = ref('')
const nickname = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        nickname: nickname.value || undefined,
        password: password.value,
      },
    })
    // 注册成功自动跳到登录页，可带回 redirect
    await navigateTo({
      path: '/login',
      query: { redirect: useRoute().query.redirect },
    })
  } catch (err) {
    errorMsg.value = (err as any)?.data?.statusMessage || '注册失败，请重试'
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
