// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: 'certs/localhost+2-key.pem',
      cert: 'certs/localhost+2.pem'
    }
  },
  runtimeConfig: {
    mysqlHost: process.env.MYSQL_HOST,
    mysqlPort: process.env.MYSQL_PORT,
    mysqlUser: process.env.MYSQL_USER,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    mysqlDatabase: process.env.MYSQL_DATABASE,
    // JWT 认证
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  routeRules: {
    // ===== 混合渲染演示 =====
    // 1) 预生成静态 HTML(构建时生成 .html 文件,托管任意静态服务器即可)
    //    注意:routeRules 的 prerender 只接受具体路径(含 * 的通配符不会触发预渲染)
    '/static/**': { prerender: true },
    // 2) 纯 SPA(客户端渲染,服务端不渲染,无 SEO)
    '/app/**': { ssr: false },
    // 3) 其余路径保持默认 SSR(服务端渲染,实时请求后端)
    //    这里不需要写配置,默认行为就是 ssr: true
  },
  nitro: {
    prerender: {
      // 显式声明要预渲染的路由(Nitro 默认 crawlLinks: false,不会自动发现路由)
      routes: ['/static/faq', '/static/team', '/static/pricing']
    }
  }
})
