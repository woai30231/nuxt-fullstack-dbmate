import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// 上传文件存放目录(相对于项目根目录)
export const UPLOAD_DIR = path.resolve(process.cwd(), '.data', 'uploads')

// 确保上传目录存在
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
  return UPLOAD_DIR
}

// 生成随机存储文件名: 时间戳 + 随机串 + 扩展名
export function generateStoredName(originalName: string) {
  const ext = path.extname(originalName) // 含点,如 ".png"
  const rand = crypto.randomBytes(8).toString('hex')
  return `${Date.now()}-${rand}${ext}`
}

// 从原始文件名提取扩展名(小写,不含点),用于归类
export function extractExt(originalName: string) {
  const ext = path.extname(originalName).toLowerCase().replace('.', '')
  return ext || null
}

// 安全拼接路径,防止 ../ 路径穿越
export function safeJoin(base: string, ...parts: string[]) {
  const resolved = path.resolve(base, ...parts)
  if (!resolved.startsWith(base)) {
    throw createError({ statusCode: 400, statusMessage: '非法的文件路径' })
  }
  return resolved
}
