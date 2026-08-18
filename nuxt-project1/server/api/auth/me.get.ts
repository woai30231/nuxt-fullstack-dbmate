// GET /api/auth/me —— 获取当前登录用户信息（token 校验）
export default defineEventHandler(async (event) => {
  const jwt = await getUserFromEvent(event)

  const db = useMysql()
  const [rows] = await db.query(
    `SELECT id, username, email, nickname, avatar, role, status, created_at, last_login_at
     FROM users WHERE id = ?`,
    [jwt.userId],
  )
  const user = (rows as any[])[0]

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '用户不存在' })
  }
  if (user.status !== 1) {
    throw createError({ statusCode: 403, statusMessage: '账号已被禁用' })
  }

  return { user }
})
