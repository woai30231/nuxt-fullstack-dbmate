export default defineEventHandler(async () => {
  try {
    logger.info('开始查询日记列表')

    const db = useMysql()
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        weather,
        mood,
        diary_date AS diaryDate,
        author,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM diaries
      ORDER BY diary_date DESC, id DESC
    `)

    const list = rows as any[]
    logger.info(`日记列表查询成功，共 ${list.length} 条`)

    return {
      list,
      total: list.length,
    }
  }
  catch (error) {
    logger.error(
      `日记列表查询失败: ${error instanceof Error ? (error.stack || error.message) : String(error)}`,
    )
    throw error
  }
})
