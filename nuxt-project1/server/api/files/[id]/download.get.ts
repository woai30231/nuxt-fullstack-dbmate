import fs from 'node:fs'
import path from 'node:path'
import { ensureUploadDir, safeJoin } from '../../../utils/file-storage'

// 下载/预览文件: 通过 id 返回文件内容
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  try {
    logger.info(`开始读取文件, id=${id}`)

    const db = useMysql()
    const [rows] = await db.query(
      'SELECT original_name AS originalName, stored_name AS storedName, mime_type AS mimeType FROM files WHERE id = ?',
      [id],
    )

    const file = (rows as any[])[0]
    if (!file) {
      throw createError({ statusCode: 404, statusMessage: '文件不存在' })
    }

    const dir = ensureUploadDir()
    const filePath = safeJoin(dir, file.storedName)

    if (!fs.existsSync(filePath)) {
      throw createError({ statusCode: 404, statusMessage: '磁盘文件已丢失' })
    }

    const data = await fs.promises.readFile(filePath)

    // 设置响应头: 内容类型 + 下载文件名(UTF-8 编码处理中文)
    setHeader(event, 'Content-Type', file.mimeType || 'application/octet-stream')
    setHeader(
      event,
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
    )

    return data
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && (error as any).statusCode === 404) {
      throw error
    }
    logger.error(`文件读取失败, id=${id}: ${error instanceof Error ? (error.stack || error.message) : String(error)}`)
    throw error
  }
})
