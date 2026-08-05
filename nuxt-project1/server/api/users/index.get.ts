export default defineEventHandler(async () => {
  // 模拟网络延迟，方便观察 pending 状态
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    list: users,
    total: users.length,
  }
})
