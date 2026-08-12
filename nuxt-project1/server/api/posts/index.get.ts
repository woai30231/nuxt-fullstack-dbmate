export default defineEventHandler(async () => {
  try {
    logger.info('开始查询文章列表')

    const db = useMysql()
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        summary,
        content,
        author,
        published_at AS publishedAt
      FROM posts
      ORDER BY id ASC
    `)

    const list = rows as any[]
    logger.info(`文章列表查询成功，共 ${list.length} 条`)

    return {
      list,
      total: list.length,
    }
  }
  catch (error) {
    logger.error(
      `文章列表查询失败: ${error instanceof Error ? (error.stack || error.message) : String(error)}`,
    )
    throw error
  }
})
