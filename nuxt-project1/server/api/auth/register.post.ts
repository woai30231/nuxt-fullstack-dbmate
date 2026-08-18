import bcrypt from 'bcryptjs'

// POST /api/auth/register —— 注册新用户，密码 bcrypt 加密存储
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password, email, nickname } = body || {}

  if (!username || !password || !email) {
    throw createError({ statusCode: 400, statusMessage: '用户名、密码、邮箱为必填项' })
  }
  if (username.length < 3 || username.length > 20) {
    throw createError({ statusCode: 400, statusMessage: '用户名长度需在 3~20 个字符之间' })
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: '密码长度不能少于 6 位' })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: '邮箱格式不正确' })
  }

  const db = useMysql()

  // 用户名/邮箱唯一性检查
  const [exists] = await db.query(
    `SELECT id FROM users WHERE username = ? OR email = ?`,
    [username, email],
  )
  if ((exists as any[]).length > 0) {
    throw createError({ statusCode: 409, statusMessage: '用户名或邮箱已被注册' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const [result] = await db.execute(
    `INSERT INTO users (username, email, password_hash, nickname, role)
     VALUES (?, ?, ?, ?, 'user')`,
    [username, email, passwordHash, nickname || null],
  )
  const insertId = (result as any).insertId

  logger.info(`新用户注册成功：${username} (id=${insertId})`)
  return {
    id: insertId,
    username,
    email,
    nickname: nickname || null,
    role: 'user',
  }
})
