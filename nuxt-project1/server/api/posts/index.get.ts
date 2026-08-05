export default defineEventHandler(() => {
  return {
    list: posts,
    total: posts.length,
  }
})
