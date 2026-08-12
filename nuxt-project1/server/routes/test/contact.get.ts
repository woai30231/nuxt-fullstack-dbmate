export default defineEventHandler(() => {
  try {
    logger.info('访问联系接口 /test/contact')

    return {
      message: '联系我们，电话xxxxxxx',
    }
  }
  catch (error) {
    logger.error(
      `联系接口异常: ${error instanceof Error ? (error.stack || error.message) : String(error)}`,
    )
    throw error
  }
})
