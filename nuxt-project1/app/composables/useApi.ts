// 自动附加 Authorization 请求头的 $fetch 客户端
// 用法：const $api = useApi(); await $api('/api/auth/me')
export function useApi() {
  const token = useCookie('token')

  return $fetch.create({
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...(options.headers || {}),
          authorization: `Bearer ${token.value}`,
        }
      }
    },
  })
}
