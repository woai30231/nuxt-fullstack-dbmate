// 客户端接收 SSE 随机字符串的 composable
// 用法:const { message, connect, disconnect } = useRandomStream()
import type { Ref } from 'vue'

interface StreamMessage {
  time: string
  value: string
}

export function useRandomStream() {
  const message: Ref<StreamMessage | null> = ref(null)
  const status: Ref<'idle' | 'connected' | 'closed'> = ref('idle')
  let source: EventSource | null = null

  function connect() {
    // 已连接则先断开,避免重复连接
    if (source) disconnect()

    source = new EventSource('/api/random-stream')

    source.onopen = () => {
      status.value = 'connected'
    }

    source.onmessage = (e: MessageEvent) => {
      try {
        message.value = JSON.parse(e.data)
      } catch {
        message.value = { time: new Date().toISOString(), value: e.data }
      }
    }

    source.onerror = () => {
      // EventSource 会自动重连,这里仅记录状态
      status.value = 'closed'
    }
  }

  function disconnect() {
    source?.close()
    source = null
    status.value = 'closed'
  }

  // 组件卸载时自动断开连接
  onUnmounted(() => disconnect())

  return { message, status, connect, disconnect }
}
