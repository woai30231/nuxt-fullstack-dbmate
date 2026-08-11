export default defineEventHandler(async () => {
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

  return {
    list,
    total: list.length,
  }
})