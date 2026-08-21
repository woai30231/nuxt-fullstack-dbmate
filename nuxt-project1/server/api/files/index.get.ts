// 文件列表接口
export default defineEventHandler(async () => {
  try {
    logger.info('开始查询文件列表')

    const db = useMysql()
    const [rows] = await db.query(`
      SELECT
        id,
        original_name AS originalName,
        stored_name AS storedName,
        ext,
        mime_type AS mimeType,
        size,
        uploader,
        created_at AS createdAt
      FROM files
      ORDER BY id DESC
    `)

    const list = rows as any[]
    logger.info(`文件列表查询成功, 共 ${list.length} 条`)

    return { list, total: list.length }
  }
  catch (error) {
    logger.error(`文件列表查询失败: ${error instanceof Error ? (error.stack || error.message) : String(error)}`)
    throw error
  }
})
