# 🖼️ 視覺化設定指南

## Supabase 操作截圖說明

### 1. 建立 Supabase 專案

#### 步驟 1-1: 前往 Supabase 官網
```
🌐 開啟瀏覽器 → https://supabase.com
```

#### 步驟 1-2: 註冊/登入
```
┌─────────────────────────────────────┐
│ 🏠 Supabase 首頁                    │
├─────────────────────────────────────┤
│                                     │
│  [Start your project] [Sign in]     │
│                                     │
│  ↑ 點擊這裡開始                      │
└─────────────────────────────────────┘
```

#### 步驟 1-3: 建立新專案
```
┌─────────────────────────────────────┐
│ 📊 Dashboard                        │
├─────────────────────────────────────┤
│ Your projects                       │
│                                     │
│ [+ New project]  ← 點擊這裡          │
│                                     │
└─────────────────────────────────────┘
```

#### 步驟 1-4: 填寫專案資訊
```
┌─────────────────────────────────────┐
│ Create a new project                │
├─────────────────────────────────────┤
│ Name: [todo-app-nextjs        ]     │
│ Database Password: [••••••••••]     │
│ Region: [Singapore (ap-southeast-1)]│
│                                     │
│ [Create new project]                │
└─────────────────────────────────────┘
```

### 2. 進入 SQL Editor

#### 步驟 2-1: 找到 SQL Editor
```
┌─────────────────────────────────────┐
│ 📊 Project Dashboard                │
├─────────────────────────────────────┤
│ 📋 Table Editor                     │
│ 🔧 SQL Editor      ← 點擊這裡        │
│ 🔑 Authentication                   │
│ 📊 Database                         │
│ 🔧 Edge Functions                   │
│ 📈 Logs                             │
│ ⚙️  Settings                        │
└─────────────────────────────────────┘
```

#### 步驟 2-2: SQL Editor 介面
```
┌─────────────────────────────────────┐
│ SQL Editor                          │
├─────────────────────────────────────┤
│ [+ New query] [Templates] [History] │
├─────────────────────────────────────┤
│ 1  -- 在這裡輸入 SQL 指令            │
│ 2                                   │
│ 3                                   │
│ 4                                   │
│ 5                                   │
├─────────────────────────────────────┤
│           [Run] [Format] [Save]     │
└─────────────────────────────────────┘
```

### 3. 執行 SQL 指令

#### 步驟 3-1: 貼上 SQL 指令
```
在編輯器中貼上完整的 SQL 指令：

-- ==========================================
-- 待辦清單 App 資料表建立指令
-- ==========================================

CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更多指令...
```

#### 步驟 3-2: 執行指令
```
┌─────────────────────────────────────┐
│ SQL 指令已貼上                       │
├─────────────────────────────────────┤
│           [Run] ← 點擊執行           │
│           或按 Ctrl+Enter            │
└─────────────────────────────────────┘
```

#### 步驟 3-3: 檢查執行結果
```
✅ 成功的結果顯示：
┌─────────────────────────────────────┐
│ Results                             │
├─────────────────────────────────────┤
│ ✅ Success. No rows returned        │
│ CREATE TABLE                        │
│ ALTER TABLE                         │
│ CREATE POLICY                       │
│ CREATE FUNCTION                     │
│ CREATE TRIGGER                      │
│ INSERT 0 3                          │
└─────────────────────────────────────┘

❌ 錯誤的結果顯示：
┌─────────────────────────────────────┐
│ Results                             │
├─────────────────────────────────────┤
│ ❌ ERROR: relation "tasks" already  │
│    exists                           │
└─────────────────────────────────────┘
```

### 4. 驗證資料表建立

#### 步驟 4-1: 前往 Table Editor
```
┌─────────────────────────────────────┐
│ 📋 Table Editor     ← 點擊這裡       │
│ 🔧 SQL Editor                       │
└─────────────────────────────────────┘
```

#### 步驟 4-2: 查看 tasks 資料表
```
┌─────────────────────────────────────┐
│ Tables                              │
├─────────────────────────────────────┤
│ 📋 tasks           ← 應該看到這個     │
│    6 columns, 3 rows               │
└─────────────────────────────────────┘
```

#### 步驟 4-3: 檢查資料表結構
```
點擊 tasks 資料表後，應該看到：

┌─────────────────────────────────────┐
│ tasks table                         │
├─────────────────────────────────────┤
│ Column      Type        Nullable    │
│ id          bigint      false       │
│ title       text        false       │
│ description text        true        │
│ completed   boolean     true        │
│ created_at  timestamptz true        │
│ updated_at  timestamptz true        │
└─────────────────────────────────────┘
```

### 5. 取得 API 金鑰

#### 步驟 5-1: 前往 Settings
```
┌─────────────────────────────────────┐
│ ⚙️  Settings        ← 點擊這裡       │
│   └── API                          │
│   └── Database                     │
│   └── Auth                         │
└─────────────────────────────────────┘
```

#### 步驟 5-2: 點擊 API
```
┌─────────────────────────────────────┐
│ Settings                            │
├─────────────────────────────────────┤
│ 🔧 General                          │
│ 🔑 API             ← 點擊這裡        │
│ 🗄️  Database                        │
│ 🔐 Auth                             │
└─────────────────────────────────────┘
```

#### 步驟 5-3: 複製 API 資訊
```
┌─────────────────────────────────────┐
│ API Settings                        │
├─────────────────────────────────────┤
│ Project URL                         │
│ https://abc123.supabase.co [📋]     │
│                                     │
│ API Keys                            │
│ anon public                         │
│ eyJ0eXAiOiJKV1Qi... [📋] ← 複製這個  │
│                                     │
│ service_role secret                 │
│ eyJ0eXAiOiJKV1Qi... [📋]           │
└─────────────────────────────────────┘

⚠️ 注意：只複製 "anon public" 金鑰，不要複製 service_role
```

### 6. 設定環境變數

#### 步驟 6-1: 開啟 .env.local 檔案
```
📁 專案資料夾
├── .env.example
├── .env.local      ← 編輯這個檔案
├── package.json
└── ...
```

#### 步驟 6-2: 填入 API 資訊
```
# .env.local 檔案內容

NEXT_PUBLIC_SUPABASE_URL=https://你的專案ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon金鑰

# 範例：
# NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 🚨 常見錯誤和解決方法

### 錯誤 1: 找不到 SQL Editor
```
❌ 問題：左側選單沒有 SQL Editor
✅ 解決：
   1. 等待專案完全建立完成（綠色狀態）
   2. 重新整理頁面
   3. 確認你有專案的管理權限
```

### 錯誤 2: SQL 執行失敗
```
❌ 問題：ERROR: relation "tasks" already exists
✅ 解決：
   1. 資料表已存在，可以跳過建立步驟
   2. 或者先執行：DROP TABLE IF EXISTS tasks CASCADE;
   3. 然後重新執行建立指令
```

### 錯誤 3: 環境變數無效
```
❌ 問題：應用程式無法連接到 Supabase
✅ 解決：
   1. 檢查 .env.local 檔案是否存在
   2. 確認變數名稱正確（NEXT_PUBLIC_SUPABASE_URL）
   3. 確認沒有多餘的空格或引號
   4. 重新啟動開發伺服器（npm run dev）
```

### 錯誤 4: 權限被拒絕
```
❌ 問題：permission denied for table tasks
✅ 解決：
   1. 確認 RLS 政策已建立
   2. 重新執行政策建立指令：
      CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
```

## ✅ 設定完成檢查清單

- [ ] Supabase 專案已建立並顯示為 Active 狀態
- [ ] SQL Editor 中成功執行了所有指令
- [ ] Table Editor 中可以看到 tasks 資料表
- [ ] tasks 資料表有 6 個欄位（id, title, description, completed, created_at, updated_at）
- [ ] 可以看到 3 筆測試資料
- [ ] 已複製 Project URL 和 anon key
- [ ] .env.local 檔案已正確設定
- [ ] 執行 npm run dev 後應用程式正常運作
- [ ] 可以在 http://localhost:3000 看到待辦清單介面

如果以上都完成，恭喜你成功設定了 Supabase！🎉