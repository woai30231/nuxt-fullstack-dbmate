-- 001_seed_posts.sql
-- 说明：文章演示数据（来自 server/utils/mock-data.ts）
-- 注意：种子数据一般只在本地/测试环境执行，生产环境按需决定是否执行
-- 执行前请先：USE nuxt_demo;
-- 依赖：migrations/001_create_posts.sql

INSERT INTO posts (id, title, summary, content, author, published_at) VALUES
(1, '认识 Nuxt 文件路由', 'pages 目录如何自动变成路由。', '在 Nuxt 中，app/pages 下的每个 .vue 文件都会自动注册为路由。index.vue 对应 /，about.vue 对应 /about，posts/[id].vue 对应动态路由。', '小明', '2026-07-01'),
(2, '用 useFetch 请求接口', 'SSR 友好的数据获取方式。', 'useFetch 会在服务端和客户端按需请求，并把结果注入页面。它适合列表页、详情页等需要首屏数据的场景，还能自动处理 loading 与 error。', '小红', '2026-07-12'),
(3, 'server/api 写后端接口', '同一个项目里前后端一起写。', 'Nuxt 内置 Nitro。把文件放在 server/api 下即可变成 API，例如 posts/index.get.ts 对应 GET /api/posts。非常适合原型和全栈小项目。', '阿强', '2026-07-20'),
(4, '布局与页面如何配合', 'NuxtLayout + NuxtPage 的套娃关系。', 'app.vue 负责总外壳，layouts 负责导航等公共结构，pages 只关心当前路由内容。这样换页时导航可以保持不变。', '小美', '2026-08-01')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  summary = VALUES(summary),
  content = VALUES(content),
  author = VALUES(author),
  published_at = VALUES(published_at);
