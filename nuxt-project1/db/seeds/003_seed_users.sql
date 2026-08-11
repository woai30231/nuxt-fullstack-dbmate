-- 003_seed_users.sql
-- 说明：用户演示数据（来自 server/utils/mock-data.ts）
-- 执行前请先：USE nuxt_demo;
-- 依赖：migrations/003_create_users.sql

INSERT INTO users (id, name, email, role, city) VALUES
(1, '张三', 'zhangsan@example.com', '管理员', '北京'),
(2, '李四', 'lisi@example.com', '编辑', '上海'),
(3, '王五', 'wangwu@example.com', '访客', '广州'),
(4, '赵六', 'zhaoliu@example.com', '编辑', '深圳'),
(5, '钱七', 'qianqi@example.com', '访客', '杭州')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  role = VALUES(role),
  city = VALUES(city);
