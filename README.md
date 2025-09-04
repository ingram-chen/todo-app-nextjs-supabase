# 待辦清單 App - Next.js + Supabase

一個使用 Next.js 和 Supabase 建立的簡單 CRUD 待辦清單應用程式。

## 功能特色

- ✅ 新增任務
- ✅ 讀取任務列表
- ✅ 更新任務狀態
- ✅ 刪除任務
- ✅ 響應式設計
- ✅ 即時資料同步

## 技術堆疊

- **前端**: Next.js 14, React, Tailwind CSS
- **後端**: Supabase (PostgreSQL)
- **部署**: Vercel
- **狀態管理**: React Hooks

## 🚀 快速開始

### 1. 克隆專案並安裝依賴
```bash
# 如果從 Git 下載
git clone <your-repo-url>
cd todo-app-nextjs-supabase

# 安裝依賴
npm install

# 執行設定檢查
npm run setup
```

### 2. 設定環境變數
```bash
# 複製環境變數範例檔案
cp .env.example .env.local

# 編輯 .env.local，填入你的 Supabase 設定
```

### 3. 在 Supabase 建立資料表
**詳細步驟請參考**: `docs/SUPABASE_SQL_SETUP.md`

**快速版本**:
1. 前往 Supabase Dashboard > SQL Editor
2. 複製並執行以下 SQL 指令：

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

-- 啟用 Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 建立政策允許所有操作（開發用）
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);

-- 建立自動更新時間的觸發器
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

3. 在 Settings > API 複製 Project URL 和 anon key

### 4. 驗證設定並啟動開發
```bash
# 檢查設定是否正確
npm run check-setup

# 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

### 5. 測試功能
- ✅ 新增任務
- ✅ 編輯任務內容
- ✅ 切換完成狀態
- ✅ 刪除任務
- ✅ 查看統計資訊

## 部署到 Vercel

1. 推送程式碼到 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數
4. 部署完成！

## 📚 完整文件

- **`docs/SUPABASE_SQL_SETUP.md`** - Supabase SQL Editor 詳細操作指南
- **`docs/VISUAL_SETUP_GUIDE.md`** - 視覺化設定指南（含截圖說明）
- **`docs/SETUP_GUIDE.md`** - 完整設定教學
- **`docs/SECURITY_BEST_PRACTICES.md`** - 安全性最佳實踐
- **`docs/EXTENSION_GUIDE.md`** - 功能擴展指南

## 專案結構

```
├── components/          # React 元件
│   ├── TaskForm.js     # 新增任務表單
│   ├── TaskItem.js     # 單一任務項目
│   └── TaskList.js     # 任務列表
├── lib/                # 工具函數和設定
│   └── supabase.js     # Supabase 設定和 API
├── pages/              # Next.js 頁面
│   ├── _app.js         # App 元件
│   └── index.js        # 首頁
├── styles/             # 樣式檔案
│   └── globals.css     # 全域樣式
├── docs/               # 完整文件
└── public/             # 靜態資源
```