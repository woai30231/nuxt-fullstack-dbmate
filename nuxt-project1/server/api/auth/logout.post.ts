// POST /api/auth/logout —— 清除登录 Cookie
export default defineEventHandler((event) => {
  deleteCookie(event, 'token', { path: '/' })
  deleteCookie(event, 'logged_in', { path: '/' })
  logger.info('用户登出')
  return { ok: true }
})
