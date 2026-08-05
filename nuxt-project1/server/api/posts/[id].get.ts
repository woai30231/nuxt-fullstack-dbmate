export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const post = posts.find((item) => item.id === id)

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: '文章不存在',
    })
  }

  return post
})
