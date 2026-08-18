import bcrypt from 'bcryptjs'

// POST /api/auth/login —— 用户名密码登录，签发 JWT 并返回 token
// 前端把 token 存起来，之后每次请求通过 Authorization: Bearer <token> 请求头携带
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

  // 同时写入一个普通 cookie 作为 token 的存储容器：
  // - 前端 useCookie('token') 可读可写，路由守卫用它判断登录态
  // - 浏览器请求会自动携带，SSR 阶段服务端也能读到（保证刷新页面登录态不丢）
  // - 真正的鉴权走 Authorization 请求头，cookie 仅作存储（非 httpOnly，前端可读）
  setCookie(event, 'token', token, {
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 天，与 JWT 有效期一致
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
