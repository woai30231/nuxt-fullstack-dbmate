<script setup lang="ts">
// 右下角悬浮组件:展示服务器定时推送的随机字符串
const { message, status, connect } = useRandomStream()

// 页面加载后自动建立 SSE 连接
onMounted(() => connect())
</script>

<template>
  <div class="float-box">
    <div class="float-box__header">
      <span class="dot" :class="status" />
      <strong>服务器实时推送</strong>
    </div>
    <div class="float-box__body">
      <template v-if="message">
        <div class="value">{{ message.value }}</div>
        <div class="time">{{ message.time }}</div>
      </template>
      <div v-else class="placeholder">等待服务器推送…</div>
    </div>
  </div>
</template>

<style scoped>
.float-box {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 260px;
  background: #1f2937;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 9999;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.float-box__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.9rem;
  background: #111827;
  font-size: 0.82rem;
  color: #d1d5db;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  flex-shrink: 0;
}

.dot.connected {
  background: #34d399;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2);
}

.float-box__body {
  padding: 1rem 0.9rem;
}

.value {
  font-size: 1.5rem;
  letter-spacing: 0.08em;
  color: #00dc82;
  word-break: break-all;
}

.time {
  margin-top: 0.4rem;
  font-size: 0.7rem;
  color: #9ca3af;
}

.placeholder {
  color: #9ca3af;
  font-size: 0.85rem;
}
</style>
