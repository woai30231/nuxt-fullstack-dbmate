// POST /api/auth/logout —— 清除本地 token 存储（服务端无状态，登出主要靠前端删除 token）
export default defineEventHandler((event) => {
  deleteCookie(event, 'token', { path: '/' })
  logger.info('用户登出')
  return { ok: true }
})
