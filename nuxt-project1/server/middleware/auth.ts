// 服务端鉴权中间件：保护 /api/**（登录注册等 /api/auth/** 放行）
export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname

  // 只保护 API；页面请求（含预渲染静态页）与 /api/auth/** 直接放行
  if (!pathname.startsWith('/api/') || pathname.startsWith('/api/auth/')) {
    return
  }

  await getUserFromEvent(event)
})
