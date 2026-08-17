-- 004_seed_diaries.sql
-- 说明：小明的日记演示数据（本地/测试环境使用）
-- 注意：种子数据一般只在本地/测试环境执行，生产环境按需决定是否执行
-- 执行前请先：USE nuxt_demo;
-- 依赖：migrations/004_create_diaries.sql

SET NAMES utf8mb4;

INSERT INTO diaries (id, title, content, weather, mood, diary_date, author) VALUES
(1, '第一次独自做晚饭', '今天终于鼓起勇气自己下厨，做了番茄炒蛋和清炒时蔬。虽然盐放多了有点咸，但看着自己做的菜上桌，特别有成就感！下次一定要少放点盐。', '晴', '开心', '2026-08-15', '小明'),
(2, '读完《百年孤独》', '花了两个星期终于把《百年孤独》读完了。布恩迪亚家族七代人的故事让我震撼，晚上躺在床上翻来覆去睡不着，脑海里全是魔幻的画面。', '多云', '平静', '2026-08-14', '小明'),
(3, '雨天忘带伞', '下班时突然下起大雨，没带伞，淋着雨跑了十分钟才到家。衣服全湿透了，但心里反而有点畅快，好久没有这么肆无忌惮地淋雨了。', '雨', '低落', '2026-08-13', '小明'),
(4, '明天要去爬山', '和朋友约好了明天去爬白云山，晚上收拾背包的时候兴奋得睡不着。天气预报说明天是大晴天，希望一切顺利，能看到日出！', '晴', '期待', '2026-08-16', '小明')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  content = VALUES(content),
  weather = VALUES(weather),
  mood = VALUES(mood),
  diary_date = VALUES(diary_date),
  author = VALUES(author);
