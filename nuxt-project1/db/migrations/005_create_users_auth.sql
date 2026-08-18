-- migrate:up
-- 重建 users 为完整认证用户表（原 003 表仅演示字段，无密码）
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL COMMENT '登录名',
  email VARCHAR(100) NOT NULL COMMENT '邮箱',
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 密码哈希',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称/显示名',
  avatar VARCHAR(255) DEFAULT NULL COMMENT '头像 URL',
  role VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色: user/admin',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '账号状态: 1=正常 0=禁用',
  last_login_at DATETIME DEFAULT NULL COMMENT '最近登录时间',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初始管理员账号：admin / admin123（生产环境请务必修改）
INSERT INTO users (username, email, password_hash, nickname, role) VALUES
('admin', 'admin@example.com', '$2b$10$U9EbPoWxYQQ793WqWBsw8u59pwT9y2F0dHt4crFOjFzOHxmpUAC26', '管理员', 'admin');

-- migrate:down
DROP TABLE IF EXISTS users;
