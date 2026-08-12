export default defineEventHandler(async () => {
  try {
    logger.info('开始查询用户列表')

    // 模拟网络延迟，方便观察 pending 状态
    await new Promise((resolve) => setTimeout(resolve, 400))

    logger.info(`用户列表查询成功，共 ${users.length} 条`)

    return {
      list: users,
      total: users.length,
    }
  }
  catch (error) {
    logger.error(
      `用户列表查询失败: ${error instanceof Error ? (error.stack || error.message) : String(error)}`,
    )
    throw error
  }
})
