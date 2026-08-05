export interface Post {
  id: number
  title: string
  summary: string
  content: string
  author: string
  publishedAt: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  description: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  city: string
}

export const posts: Post[] = [
  {
    id: 1,
    title: '认识 Nuxt 文件路由',
    summary: 'pages 目录如何自动变成路由。',
    content: '在 Nuxt 中，app/pages 下的每个 .vue 文件都会自动注册为路由。index.vue 对应 /，about.vue 对应 /about，posts/[id].vue 对应动态路由。',
    author: '小明',
    publishedAt: '2026-07-01',
  },
  {
    id: 2,
    title: '用 useFetch 请求接口',
    summary: 'SSR 友好的数据获取方式。',
    content: 'useFetch 会在服务端和客户端按需请求，并把结果注入页面。它适合列表页、详情页等需要首屏数据的场景，还能自动处理 loading 与 error。',
    author: '小红',
    publishedAt: '2026-07-12',
  },
  {
    id: 3,
    title: 'server/api 写后端接口',
    summary: '同一个项目里前后端一起写。',
    content: 'Nuxt 内置 Nitro。把文件放在 server/api 下即可变成 API，例如 posts/index.get.ts 对应 GET /api/posts。非常适合原型和全栈小项目。',
    author: '阿强',
    publishedAt: '2026-07-20',
  },
  {
    id: 4,
    title: '布局与页面如何配合',
    summary: 'NuxtLayout + NuxtPage 的套娃关系。',
    content: 'app.vue 负责总外壳，layouts 负责导航等公共结构，pages 只关心当前路由内容。这样换页时导航可以保持不变。',
    author: '小美',
    publishedAt: '2026-08-01',
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: '无线降噪耳机',
    category: '数码',
    price: 799,
    stock: 42,
    description: '主动降噪，续航 30 小时。',
  },
  {
    id: 2,
    name: '机械键盘',
    category: '数码',
    price: 459,
    stock: 18,
    description: '热插拔轴体，适合长时间编码。',
  },
  {
    id: 3,
    name: '露营帐篷',
    category: '户外',
    price: 328,
    stock: 9,
    description: '双人轻量帐篷，防泼水涂层。',
  },
  {
    id: 4,
    name: '不锈钢保温杯',
    category: '生活',
    price: 89,
    stock: 120,
    description: '保温 12 小时，便携杯盖。',
  },
  {
    id: 5,
    name: '运动鞋',
    category: '服饰',
    price: 569,
    stock: 25,
    description: '缓震鞋底，日常跑步通勤都合适。',
  },
]

export const users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', city: '北京' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', city: '上海' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '访客', city: '广州' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', city: '深圳' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', role: '访客', city: '杭州' },
]
