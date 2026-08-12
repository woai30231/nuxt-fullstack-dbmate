export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const category = typeof query.category === 'string' ? query.category : ''

    logger.info(
      category
        ? `开始查询商品列表，category=${category}`
        : '开始查询商品列表（全部）',
    )

    const list = category
      ? products.filter((item) => item.category === category)
      : products

    logger.info(`商品列表查询成功，共 ${list.length} 条`)

    return {
      list,
      total: list.length,
      categories: [...new Set(products.map((item) => item.category))],
    }
  }
  catch (error) {
    logger.error(
      `商品列表查询失败: ${error instanceof Error ? (error.stack || error.message) : String(error)}`,
    )
    throw error
  }
})
