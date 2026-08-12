export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  try {
    logger.info(`开始查询文章详情，id=${id}`)

    const db = useMysql()
    const [rows] = await db.query(
      `
      SELECT
        id,
        title,
        summary,
        content,
        author,
        published_at AS publishedAt
      FROM posts
      WHERE id = ?
      `,
      [id],
    )

    const list = rows as any[]
    const post = list[0]

    if (!post) {
      logger.warn(`文章不存在，id=${id}`)
      throw createError({
        statusCode: 404,
        statusMessage: '文章不存在',
      })
    }

    logger.info(`文章详情查询成功，id=${id}, title=${post.title}`)
    return post
  }
  catch (error) {
    // createError 抛出的业务错误也走这里，404 用 warn 即可区分
    if (error && typeof error === 'object' && 'statusCode' in error && (error as any).statusCode === 404) {
      throw error
    }

    logger.error(
      `文章详情查询失败，id=${id}: ${error instanceof Error ? (error.stack || error.message) : String(error)}`,
    )
    throw error
  }
})
