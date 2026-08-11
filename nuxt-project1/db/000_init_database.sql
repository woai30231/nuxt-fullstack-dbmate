-- 000_init_database.sql
-- 说明：仅用于「全新环境」创建库。已有同名库可跳过。
-- 各环境的库名也可以不同，那时请改成你们环境约定的名字，并在 .env 里对应配置。

CREATE DATABASE IF NOT EXISTS nuxt_demo
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
