-- ==========================================
-- 待辦清單 App - Supabase 資料表建立指令
-- ==========================================
-- 
-- 使用方法：
-- 1. 複製以下所有 SQL 指令
-- 2. 在 Supabase Dashboard > SQL Editor 中貼上
-- 3. 點擊 "Run" 執行
-- 
-- ==========================================

-- 1. 建立 tasks 資料表
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 啟用 Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 3. 建立政策允許所有操作（開發環境用）
-- 注意：生產環境建議使用更嚴格的權限控制
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);

-- 4. 建立自動更新 updated_at 的函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 建立觸發器自動更新 updated_at
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 建立索引提升查詢效能
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- 7. 插入一些測試資料（可選）
INSERT INTO tasks (title, description, completed) VALUES
('歡迎使用待辦清單 App! 🎉', '這是一個使用 Next.js 和 Supabase 建立的範例任務，你可以編輯或刪除它', false),
('完成專案設定 ⚙️', '設定 Supabase 資料庫和環境變數', true),
('測試 CRUD 功能 🧪', '測試新增、讀取、更新、刪除功能是否正常運作', false),
('部署到 Vercel 🚀', '將應用程式部署到 Vercel 平台', false),
('閱讀文件 📚', '查看 docs/ 資料夾中的詳細文件和最佳實踐', false);

-- ==========================================
-- 執行完成後，你應該會看到：
-- 
-- ✅ CREATE TABLE
-- ✅ ALTER TABLE  
-- ✅ CREATE POLICY
-- ✅ CREATE FUNCTION
-- ✅ CREATE TRIGGER
-- ✅ CREATE INDEX (x2)
-- ✅ INSERT 0 5
-- 
-- 如果看到這些訊息，表示設定成功！
-- ==========================================