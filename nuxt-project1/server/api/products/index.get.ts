export default defineEventHandler((event) => {
  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : ''

  const list = category
    ? products.filter((item) => item.category === category)
    : products

  return {
    list,
    total: list.length,
    categories: [...new Set(products.map((item) => item.category))],
  }
})
