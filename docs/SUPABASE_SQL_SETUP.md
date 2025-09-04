# Supabase SQL Editor 詳細操作指南

## 📋 完整步驟說明

### 步驟 1: 建立 Supabase 專案

1. **前往 Supabase 官網**
   - 開啟瀏覽器，前往 [https://supabase.com](https://supabase.com)
   - 點擊右上角的 "Start your project" 或 "Sign up"

2. **註冊或登入帳號**
   - 可以使用 GitHub、Google 或 Email 註冊
   - 建議使用 GitHub 登入，方便後續整合

3. **建立新專案**
   - 登入後會看到 Dashboard，點擊 "New Project"
   - 選擇或建立一個 Organization（組織）
   - 填寫專案資訊：
     ```
     Name: todo-app-nextjs（或你喜歡的名稱）
     Database Password: 設定一個強密碼（請記住這個密碼）
     Region: Southeast Asia (Singapore) - ap-southeast-1
     ```
   - 點擊 "Create new project"
   - 等待 2-3 分鐘讓專案建立完成

### 步驟 2: 進入 SQL Editor

1. **找到 SQL Editor**
   - 專案建立完成後，你會看到專案的 Dashboard
   - 在左側選單中找到並點擊 "SQL Editor"
   - 或者直接點擊 "Table Editor" 旁邊的 SQL 圖示

2. **SQL Editor 介面說明**
   ```
   ┌─────────────────────────────────────────┐
   │ SQL Editor                              │
   ├─────────────────────────────────────────┤
   │ [New query] [Templates] [History]       │
   ├─────────────────────────────────────────┤
   │                                         │
   │  在這裡輸入 SQL 指令                      │
   │                                         │
   │                                         │
   ├─────────────────────────────────────────┤
   │ [Run] [Format] [Save]                   │
   └─────────────────────────────────────────┘
   ```

### 步驟 3: 執行 SQL 指令建立資料表

1. **清空編輯器**
   - 如果編輯器中有預設內容，請先全選刪除

2. **複製並貼上 SQL 指令**
   - 複製以下完整的 SQL 指令：

```sql
-- ==========================================
-- 待辦清單 App 資料表建立指令
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
('歡迎使用待辦清單 App', '這是一個使用 Next.js 和 Supabase 建立的範例任務', false),
('完成專案設定', '設定 Supabase 資料庫和環境變數', true),
('測試 CRUD 功能', '測試新增、讀取、更新、刪除功能是否正常運作', false);
```

3. **執行 SQL 指令**
   - 將上述 SQL 指令貼到編輯器中
   - 點擊右下角的 "Run" 按鈕（或按 Ctrl+Enter）
   - 等待執行完成

4. **檢查執行結果**
   - 如果成功，你會看到類似這樣的訊息：
   ```
   Success. No rows returned
   CREATE TABLE
   ALTER TABLE
   CREATE POLICY
   CREATE FUNCTION
   CREATE TRIGGER
   CREATE INDEX
   CREATE INDEX
   INSERT 0 3
   ```
   - 如果有錯誤，會顯示錯誤訊息，請檢查 SQL 語法

### 步驟 4: 驗證資料表建立成功

1. **使用 Table Editor 檢查**
   - 點擊左側選單的 "Table Editor"
   - 你應該會看到 "tasks" 資料表
   - 點擊 tasks 資料表，查看欄位結構

2. **檢查資料表結構**
   ```
   欄位名稱        類型                    說明
   ─────────────────────────────────────────
   id            bigint (Primary Key)    自動遞增的主鍵
   title         text                    任務標題（必填）
   description   text                    任務描述（可選）
   completed     boolean                 完成狀態（預設 false）
   created_at    timestamptz            建立時間（自動）
   updated_at    timestamptz            更新時間（自動）
   ```

3. **檢查測試資料**
   - 在 Table Editor 中，你應該會看到 3 筆測試資料
   - 如果看到資料，表示設定成功！

### 步驟 5: 取得 API 金鑰

1. **前往 API 設定頁面**
   - 點擊左側選單的 "Settings"
   - 點擊 "API"

2. **複製必要資訊**
   ```
   Project URL: https://xyzabc123.supabase.co
   anon public: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```
   - 複製 "Project URL"
   - 複製 "anon" "public" 金鑰（不是 service_role）

3. **更新環境變數**
   - 開啟專案中的 `.env.local` 檔案
   - 填入剛才複製的資訊：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://你的專案ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon金鑰
   ```

## 🔍 常見問題排除

### 問題 1: SQL 執行失敗
**錯誤訊息**: `relation "tasks" already exists`
**解決方法**: 資料表已存在，可以先刪除再重建：
```sql
DROP TABLE IF EXISTS tasks CASCADE;
-- 然後重新執行建立指令
```

### 問題 2: 權限錯誤
**錯誤訊息**: `permission denied for table tasks`
**解決方法**: 確認 RLS 政策已正確建立：
```sql
-- 檢查政策
SELECT * FROM pg_policies WHERE tablename = 'tasks';

-- 重新建立政策
DROP POLICY IF EXISTS "Allow all operations" ON tasks;
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
```

### 問題 3: 找不到 SQL Editor
**解決方法**: 
- 確認專案已完全建立完成
- 重新整理頁面
- 檢查左側選單是否完整載入

### 問題 4: 無法連接到資料庫
**解決方法**:
- 檢查專案狀態是否為 "Active"
- 確認網路連線正常
- 等待幾分鐘後重試

## ✅ 驗證設定成功

完成上述步驟後，你可以：

1. **在 Table Editor 中看到 tasks 資料表**
2. **看到 3 筆測試資料**
3. **API 金鑰已複製到 .env.local**
4. **執行 `npm run dev` 啟動應用程式**
5. **在 http://localhost:3000 看到運作中的待辦清單**

如果以上都正常，恭喜你！Supabase 設定完成！🎉