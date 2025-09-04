# 🚀 Vercel 部署詳細指南

## 方法 2: 使用 Vercel Dashboard（推薦）

### 步驟 1: 前往 Vercel 並登入
1. 開啟瀏覽器，前往 [https://vercel.com](https://vercel.com)
2. 點擊右上角 "Sign Up" 或 "Log In"
3. 建議使用 GitHub 帳號登入（方便匯入專案）

### 步驟 2: 建立新專案
```
┌─────────────────────────────────────┐
│ 🏠 Vercel Dashboard                 │
├─────────────────────────────────────┤
│ Your Projects                       │
│                                     │
│ [+ New Project]  ← 點擊這裡          │
│                                     │
└─────────────────────────────────────┘
```

### 步驟 3: 匯入 GitHub Repository
```
┌─────────────────────────────────────┐
│ Import Git Repository               │
├─────────────────────────────────────┤
│ 🔍 Search repositories...           │
│                                     │
│ 📁 monday1tw-create/                │
│    todo-app-nextjs-supabase         │
│    [Import] ← 點擊這裡               │
│                                     │
└─────────────────────────────────────┘
```

### 步驟 4: 設定專案配置
```
┌─────────────────────────────────────┐
│ Configure Project                   │
├─────────────────────────────────────┤
│ Project Name:                       │
│ [todo-app-nextjs-supabase    ]      │
│                                     │
│ Framework Preset: Next.js ✅        │
│ Root Directory: ./                  │
│ Build Command: npm run build        │
│ Output Directory: .next             │
│                                     │
│ ⚠️ 先不要點 Deploy！                 │
│    需要先設定環境變數                 │
└─────────────────────────────────────┘
```

### 步驟 5: 設定環境變數（重要！）

#### 5-1: 找到環境變數設定
```
在 Configure Project 頁面中，往下滾動找到：

┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ Add environment variables to use    │
│ in your project.                    │
│                                     │
│ [+ Add]  ← 點擊這裡新增環境變數       │
└─────────────────────────────────────┘
```

#### 5-2: 新增第一個環境變數
```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Name (key):                         │
│ [NEXT_PUBLIC_SUPABASE_URL    ]      │
│                                     │
│ Value:                              │
│ [https://你的專案ID.supabase.co]     │
│                                     │
│ Environments:                       │
│ ☑️ Production                       │
│ ☑️ Preview                          │
│ ☑️ Development                      │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

#### 5-3: 新增第二個環境變數
再次點擊 [+ Add]，新增：
```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Name (key):                         │
│ [NEXT_PUBLIC_SUPABASE_ANON_KEY]     │
│                                     │
│ Value:                              │
│ [eyJ0eXAiOiJKV1Qi...你的anon key]   │
│                                     │
│ Environments:                       │
│ ☑️ Production                       │
│ ☑️ Preview                          │
│ ☑️ Development                      │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

#### 5-4: 確認環境變數已新增
設定完成後，你應該看到：
```
┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL            │
│ https://abc123.supabase.co          │
│ Production, Preview, Development    │
│                                     │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY       │
│ eyJ0eXAiOiJKV1Qi... (hidden)       │
│ Production, Preview, Development    │
│                                     │
│ [+ Add]                             │
└─────────────────────────────────────┘
```

### 步驟 6: 部署專案
```
┌─────────────────────────────────────┐
│ 確認所有設定都正確後：                 │
│                                     │
│ [Deploy] ← 現在點擊這裡部署           │
└─────────────────────────────────────┘
```

### 步驟 7: 等待部署完成
```
┌─────────────────────────────────────┐
│ 🚀 Deploying...                     │
├─────────────────────────────────────┤
│ ⏳ Building                         │
│ ⏳ Deploying                        │
│ ✅ Ready                            │
│                                     │
│ 🎉 Congratulations!                 │
│ Your project has been deployed.     │
│                                     │
│ [Visit] [Dashboard]                 │
└─────────────────────────────────────┘
```

## 📋 取得 Supabase 環境變數的詳細步驟

### 如何找到你的 Supabase URL 和 API Key：

#### 步驟 1: 登入 Supabase
1. 前往 [https://supabase.com](https://supabase.com)
2. 登入你的帳號
3. 選擇你的專案

#### 步驟 2: 前往 API 設定
```
┌─────────────────────────────────────┐
│ 📊 Supabase Dashboard               │
├─────────────────────────────────────┤
│ 🏠 Home                             │
│ 📋 Table Editor                     │
│ 🔧 SQL Editor                       │
│ 🔑 Authentication                   │
│ 📊 Database                         │
│ 🔧 Edge Functions                   │
│ 📈 Logs                             │
│ ⚙️  Settings          ← 點擊這裡     │
│   └── API            ← 然後點這裡    │
└─────────────────────────────────────┘
```

#### 步驟 3: 複製 API 資訊
```
┌─────────────────────────────────────┐
│ API Settings                        │
├─────────────────────────────────────┤
│ Project URL                         │
│ https://abc123def456.supabase.co    │
│ [📋 Copy] ← 複製這個 URL             │
│                                     │
│ API Keys                            │
│ anon public                         │
│ eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1... │
│ [📋 Copy] ← 複製這個 Key             │
│                                     │
│ ⚠️ 注意：只複製 anon public key      │
│    不要複製 service_role key         │
└─────────────────────────────────────┘
```

## 🔍 部署後驗證

### 1. 檢查部署狀態
部署完成後，Vercel 會給你一個 URL，例如：
```
https://todo-app-nextjs-supabase-abc123.vercel.app
```

### 2. 測試應用程式功能
開啟部署的 URL，測試：
- [ ] 頁面正常載入
- [ ] 可以看到任務列表
- [ ] 可以新增任務
- [ ] 可以編輯任務
- [ ] 可以刪除任務
- [ ] 統計資訊正確顯示

### 3. 檢查錯誤（如果有問題）
如果網站無法正常運作：

#### 3-1: 查看 Vercel 部署日誌
```
在 Vercel Dashboard 中：
1. 點擊你的專案
2. 點擊 "Functions" 或 "Deployments"
3. 查看錯誤訊息
```

#### 3-2: 常見錯誤和解決方法
```
❌ 錯誤：Cannot connect to Supabase
✅ 解決：檢查環境變數是否正確設定

❌ 錯誤：Build failed
✅ 解決：檢查程式碼是否有語法錯誤

❌ 錯誤：Environment variable not found
✅ 解決：重新設定環境變數並重新部署
```

## 🔄 更新部署

### 自動部署
當你推送新程式碼到 GitHub 時，Vercel 會自動重新部署：
```bash
# 在本地修改程式碼後
git add .
git commit -m "更新功能"
git push

# Vercel 會自動偵測並重新部署
```

### 手動重新部署
在 Vercel Dashboard 中：
1. 點擊你的專案
2. 點擊 "Deployments"
3. 點擊最新的部署旁邊的 "..." 
4. 選擇 "Redeploy"

## ✅ 部署成功檢查清單

- [ ] GitHub Repository 已建立並推送程式碼
- [ ] Vercel 帳號已建立並連接 GitHub
- [ ] 專案已成功匯入到 Vercel
- [ ] 環境變數已正確設定（兩個變數）
- [ ] 部署狀態顯示為 "Ready"
- [ ] 部署的網站可以正常開啟
- [ ] 所有 CRUD 功能都正常運作
- [ ] Supabase 資料庫連接正常

恭喜！你的待辦清單 App 現在已經成功部署到網路上了！🎉