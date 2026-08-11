export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
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
    throw createError({
      statusCode: 404,
      statusMessage: '文章不存在',
    })
  }

  return post
})