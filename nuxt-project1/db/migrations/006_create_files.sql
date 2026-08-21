-- migrate:up
CREATE TABLE files (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  original_name VARCHAR(255) NOT NULL COMMENT '用户上传的原始文件名',
  stored_name VARCHAR(255) NOT NULL COMMENT '服务器存储文件名(随机,防冲突/防路径穿越)',
  ext VARCHAR(20) DEFAULT NULL COMMENT '文件扩展名',
  mime_type VARCHAR(100) NOT NULL COMMENT 'MIME 类型,如 image/png',
  size BIGINT UNSIGNED NOT NULL COMMENT '文件大小(字节)',
  storage_path VARCHAR(500) NOT NULL COMMENT '服务器磁盘相对路径',
  uploader VARCHAR(50) DEFAULT NULL COMMENT '上传者(登录用户名)',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_files_stored_name (stored_name),
  KEY idx_files_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- migrate:down
DROP TABLE IF EXISTS files;
