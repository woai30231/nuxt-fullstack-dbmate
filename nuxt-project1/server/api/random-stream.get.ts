// SSE(Server-Sent Events) 接口:服务器定时主动推送随机字符串
// 客户端通过 EventSource 连接,每隔一定时间收到一条随机字符串
export default defineEventHandler((event) => {
  // 生成随机字符串(大写字母 + 数字,长度 8)
  function genRandom() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let str = ''
    for (let i = 0; i < 8; i++) {
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
  }

  // 设置 SSE 响应头(必须)
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no') // 关闭代理缓冲

  // 创建可读流,持续向客户端推送
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // 立即推送一条
      const first = { time: new Date().toISOString(), value: genRandom() }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(first)}\n\n`))

      // 每 3 秒推送一条
      const timer = setInterval(() => {
        const data = { time: new Date().toISOString(), value: genRandom() }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }, 3000)

      // 客户端断开连接时清理定时器
      event.node.req.on('close', () => {
        clearInterval(timer)
        controller.close()
      })
    },
  })

  return stream
})
