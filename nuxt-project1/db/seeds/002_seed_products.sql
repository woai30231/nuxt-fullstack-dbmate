-- 002_seed_products.sql
-- 说明：商品演示数据（来自 server/utils/mock-data.ts）
-- 执行前请先：USE nuxt_demo;
-- 依赖：migrations/002_create_products.sql

SET NAMES utf8mb4;

INSERT INTO products (id, name, category, price, stock, description) VALUES
(1, '无线降噪耳机', '数码', 799, 42, '主动降噪，续航 30 小时。'),
(2, '机械键盘', '数码', 459, 18, '热插拔轴体，适合长时间编码。'),
(3, '露营帐篷', '户外', 328, 9, '双人轻量帐篷，防泼水涂层。'),
(4, '不锈钢保温杯', '生活', 89, 120, '保温 12 小时，便携杯盖。'),
(5, '运动鞋', '服饰', 569, 25, '缓震鞋底，日常跑步通勤都合适。')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  price = VALUES(price),
  stock = VALUES(stock),
  description = VALUES(description);
