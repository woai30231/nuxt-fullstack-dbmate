// 全局路由守卫：除登录/注册页和预渲染静态页外，未登录一律跳登录页
export default defineNuxtRouteMiddleware((to) => {
  // 公开路径：登录页、注册页、预渲染静态页（需求：预生成页面不校验登录态）
  const publicPath =
    to.path === '/login' ||
    to.path === '/register' ||
    to.path.startsWith('/static')

  if (publicPath) return

  // 判断登录态：token cookie 存在即视为已登录
  const token = useCookie('token')
  if (!token.value) {
    // 记住原始地址，登录成功后跳回
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
