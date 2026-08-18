import bcrypt from 'bcryptjs'

// POST /api/auth/login —— 用户名密码登录，签发 JWT 并写入 httpOnly Cookie
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: '请输入用户名和密码' })
  }

  const db = useMysql()
  const [rows] = await db.query(
    `SELECT id, username, email, nickname, avatar, role, status, password_hash
     FROM users WHERE username = ?`,
    [username],
  )
  const user = (rows as any[])[0]

  if (!user) {
    logger.warn(`登录失败：用户 ${username} 不存在`)
    throw createError({ statusCode: 401, statusMessage: '用户名或密码错误' })
  }
  if (user.status !== 1) {
    throw createError({ statusCode: 403, statusMessage: '账号已被禁用' })
  }

  const matched = await bcrypt.compare(password, user.password_hash)
  if (!matched) {
    logger.warn(`登录失败：用户 ${username} 密码错误`)
    throw createError({ statusCode: 401, statusMessage: '用户名或密码错误' })
  }

  // 签发 JWT
  const token = await signToken({ userId: user.id, username: user.username, role: user.role })

  // 更新最近登录时间
  await db.query(`UPDATE users SET last_login_at = NOW() WHERE id = ?`, [user.id])

  // 写入 httpOnly Cookie（浏览器自动携带，JS 读不到，防 XSS）
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 天，与 JWT 有效期一致
  })
  // 前端可读的登录标记：httpOnly cookie 浏览器 JS 读不到，
  // Vue 路由守卫/布局要依赖它判断登录态，所以另存一个普通 cookie
  setCookie(event, 'logged_in', '1', {
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  logger.info(`用户 ${username} 登录成功`)
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
    },
  }
})
