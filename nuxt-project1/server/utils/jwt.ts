import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

// JWT 载荷结构：登录后签发到 token 里的字段
export interface AppJwtPayload {
  userId: number
  username: string
  role: string
}

// 密钥来自 nuxt.config runtimeConfig.jwtSecret（由 .env 的 JWT_SECRET 注入）
function getSecret() {
  return new TextEncoder().encode(useRuntimeConfig().jwtSecret as string)
}

/** 签发 JWT（HS256），有效期取 runtimeConfig.jwtExpiresIn，默认 7d */
export async function signToken(payload: AppJwtPayload) {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(useRuntimeConfig().jwtExpiresIn as string)
    .sign(getSecret())
}

/** 校验 JWT，失败/过期会抛错 */
export async function verifyToken(token: string): Promise<AppJwtPayload> {
  const { payload } = await jwtVerify(token, getSecret())
  return payload as unknown as AppJwtPayload
}

/** 从请求里读取并校验 token（供受保护接口用） */
export async function getUserFromEvent(event: any): Promise<AppJwtPayload> {
  const token = getCookie(event, 'token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登录' })
  }
  try {
    return await verifyToken(token)
  } catch {
    throw createError({ statusCode: 401, statusMessage: '登录已过期，请重新登录' })
  }
}
