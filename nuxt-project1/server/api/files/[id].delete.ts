import fs from 'node:fs'
import { ensureUploadDir, safeJoin } from '../../utils/file-storage'

// 删除文件: 同时删除磁盘文件 + 数据库记录
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  try {
    logger.info(`开始删除文件, id=${id}`)

    const db = useMysql()
    const [rows] = await db.query('SELECT stored_name AS storedName FROM files WHERE id = ?', [id])

    const file = (rows as any[])[0]
    if (!file) {
      throw createError({ statusCode: 404, statusMessage: '文件不存在' })
    }

    // 删除磁盘文件(不存在则忽略)
    const dir = ensureUploadDir()
    const filePath = safeJoin(dir, file.storedName)
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
    }

    // 删除数据库记录
    await db.query('DELETE FROM files WHERE id = ?', [id])

    logger.info(`文件删除成功, id=${id}`)
    return { success: true }
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && (error as any).statusCode === 404) {
      throw error
    }
    logger.error(`文件删除失败, id=${id}: ${error instanceof Error ? (error.stack || error.message) : String(error)}`)
    throw error
  }
})
