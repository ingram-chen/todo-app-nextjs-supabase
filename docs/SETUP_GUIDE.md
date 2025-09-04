# 完整設定指南

## 1. Supabase 設定步驟

### 步驟 1: 建立 Supabase 專案
1. 前往 [Supabase](https://supabase.com) 並註冊帳號
2. 點擊 "New Project" 建立新專案
3. 填入專案名稱、資料庫密碼，選擇地區（建議選擇 Singapore）
4. 等待專案建立完成（約 2-3 分鐘）

### 步驟 2: 建立資料表
1. 在 Supabase Dashboard 中，點擊左側選單的 "SQL Editor"
2. 複製 `sql/create_tables.sql` 檔案中的所有 SQL 指令
3. 或者直接使用以下指令：

```sql
-- 建立 tasks 資料表
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 啟用 Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 建立政策允許所有操作（開發環境用）
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);

-- 建立更新時間觸發器（可選）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 步驟 3: 取得 API 金鑰
1. 在 Supabase Dashboard 中，點擊左側選單的 "Settings" > "API"
2. 複製以下資訊：
   - Project URL
   - anon public key

## 2. 本地開發環境設定

### 步驟 1: 安裝 Node.js
確保你的系統已安裝 Node.js 16.8 或更新版本：
```bash
node --version
npm --version
```

### 步驟 2: 複製專案並安裝依賴
```bash
# 複製專案（如果從 Git 下載）
git clone <your-repo-url>
cd todo-app-nextjs-supabase

# 安裝依賴
npm install
```

### 步驟 3: 設定環境變數
```bash
# 複製環境變數範例檔案
cp .env.example .env.local

# 編輯 .env.local 檔案，填入你的 Supabase 設定
```

在 `.env.local` 中填入：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 步驟 4: 啟動開發伺服器
```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000)

## 3. 部署到 Vercel

### 方法 1: 使用 Vercel CLI
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 部署專案
vercel

# 設定環境變數
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 重新部署
vercel --prod
```

### 方法 2: 使用 Vercel Dashboard
1. 推送程式碼到 GitHub
2. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
3. 點擊 "New Project"
4. 匯入你的 GitHub 專案
5. 在 "Environment Variables" 中設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. 點擊 "Deploy"

## 4. 測試應用程式

### 功能測試清單
- [ ] 新增任務
- [ ] 查看任務列表
- [ ] 編輯任務標題和描述
- [ ] 切換任務完成狀態
- [ ] 刪除任務
- [ ] 任務統計顯示正確
- [ ] 響應式設計在手機上正常運作

### 常見問題排除

#### 1. 無法連接到 Supabase
- 檢查環境變數是否正確設定
- 確認 Supabase 專案狀態正常
- 檢查網路連線

#### 2. 資料表操作失敗
- 確認資料表已正確建立
- 檢查 RLS 政策設定
- 查看瀏覽器開發者工具的錯誤訊息

#### 3. 部署後環境變數問題
- 確認 Vercel 中的環境變數已正確設定
- 重新部署專案
- 檢查變數名稱是否正確（注意大小寫）

## 5. 開發建議

### 程式碼結構
```
├── components/          # React 元件
│   ├── TaskForm.js     # 新增任務表單
│   ├── TaskItem.js     # 單一任務項目
│   └── TaskList.js     # 任務列表
├── lib/                # 工具函數
│   └── supabase.js     # Supabase 設定和 API
├── pages/              # Next.js 頁面
│   ├── _app.js         # App 元件
│   └── index.js        # 首頁
├── styles/             # 樣式檔案
│   └── globals.css     # 全域樣式
└── docs/               # 文件
    └── SETUP_GUIDE.md  # 設定指南
```

### 最佳實踐
1. **錯誤處理**: 所有 API 呼叫都包含 try-catch
2. **載入狀態**: 提供視覺化的載入指示
3. **使用者體驗**: 操作後提供即時回饋
4. **響應式設計**: 支援各種螢幕尺寸
5. **程式碼註解**: 重要邏輯都有清楚的註解