import fs from 'node:fs'
import path from 'node:path'
import { ensureUploadDir, generateStoredName, extractExt, safeJoin } from '../../utils/file-storage'

// 上传文件: multipart/form-data,字段名为 file
export default defineEventHandler(async (event) => {
  try {
    logger.info('开始处理文件上传')

    const files = await readMultipartFormData(event)
    const file = files?.find((f) => f.name === 'file')

    if (!file) {
      throw createError({ statusCode: 400, statusMessage: '未找到上传的文件(字段名需为 file)' })
    }

    if (!file.filename) {
      throw createError({ statusCode: 400, statusMessage: '文件缺少文件名' })
    }

    // 限制大小(默认 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.data.length > MAX_SIZE) {
      throw createError({ statusCode: 413, statusMessage: '文件超过 10MB 限制' })
    }

    const originalName = path.basename(file.filename)
    const storedName = generateStoredName(originalName)
    const ext = extractExt(originalName)
    const mimeType = file.type || 'application/octet-stream'

    const dir = ensureUploadDir()
    const storagePath = safeJoin(dir, storedName)

    // 写入磁盘
    await fs.promises.writeFile(storagePath, file.data)

    // 写入数据库元信息
    const db = useMysql()
    const [result] = await db.query(
      `
      INSERT INTO files (original_name, stored_name, ext, mime_type, size, storage_path, uploader)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [originalName, storedName, ext, mimeType, file.data.length, storedName, 'anonymous'],
    )

    const id = (result as any).insertId
    logger.info(`文件上传成功, id=${id}, name=${originalName}, size=${file.data.length}`)

    return {
      id,
      originalName,
      storedName,
      ext,
      mimeType,
      size: file.data.length,
    }
  }
  catch (error) {
    logger.error(`文件上传失败: ${error instanceof Error ? (error.stack || error.message) : String(error)}`)
    throw error
  }
})
