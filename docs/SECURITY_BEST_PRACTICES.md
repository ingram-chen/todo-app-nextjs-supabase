# 安全性最佳實踐指南

## 1. API 金鑰保護

### 環境變數管理
```bash
# ✅ 正確：使用環境變數
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ❌ 錯誤：直接寫在程式碼中
const supabaseUrl = 'https://your-project.supabase.co'
```

### 金鑰類型說明
- **anon key**: 公開金鑰，可以在前端使用
- **service_role key**: 私密金鑰，只能在後端使用
- 本專案使用 anon key，透過 RLS 控制權限

## 2. Row Level Security (RLS) 設定

### 基本 RLS 政策
```sql
-- 啟用 RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 開發環境：允許所有操作
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
```

### 生產環境建議政策
```sql
-- 如果有使用者認證系統
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);
```

## 3. 輸入驗證

### 前端驗證
```javascript
// 驗證任務標題
const validateTitle = (title) => {
  if (!title || title.trim().length === 0) {
    throw new Error('任務標題不能為空')
  }
  if (title.length > 255) {
    throw new Error('任務標題過長')
  }
  return title.trim()
}

// 清理 HTML 內容（如果需要）
const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
```

### 後端驗證（Supabase 函數）
```sql
-- 建立檢查函數
CREATE OR REPLACE FUNCTION validate_task_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'Task title cannot be empty';
  END IF;
  
  IF LENGTH(NEW.title) > 255 THEN
    RAISE EXCEPTION 'Task title too long';
  END IF;
  
  NEW.title = TRIM(NEW.title);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器
CREATE TRIGGER validate_task_title_trigger
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION validate_task_title();
```

## 4. 錯誤處理

### 安全的錯誤訊息
```javascript
// ❌ 不安全：暴露內部錯誤
catch (error) {
  alert(error.message) // 可能暴露敏感資訊
}

// ✅ 安全：使用通用錯誤訊息
catch (error) {
  console.error('Database error:', error) // 只在開發環境記錄
  alert('操作失敗，請稍後再試') // 使用者看到的訊息
}
```

### 錯誤記錄
```javascript
// 生產環境錯誤記錄
const logError = (error, context) => {
  if (process.env.NODE_ENV === 'production') {
    // 發送到錯誤追蹤服務（如 Sentry）
    console.error('Error:', { error: error.message, context })
  } else {
    console.error('Development error:', error)
  }
}
```

## 5. 網路安全

### HTTPS 強制
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

### Content Security Policy
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

## 6. 使用者認證（進階功能）

### 新增使用者認證
```javascript
// lib/auth.js
import { supabase } from './supabase'

export const authService = {
  // 註冊
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // 登入
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // 登出
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // 取得目前使用者
  getCurrentUser() {
    return supabase.auth.getUser()
  }
}
```

### 更新資料表結構
```sql
-- 新增 user_id 欄位
ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 更新 RLS 政策
DROP POLICY IF EXISTS "Allow all operations" ON tasks;

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

## 7. 部署安全性

### Vercel 環境變數
```bash
# 設定生產環境變數
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# 設定開發環境變數
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

### 域名限制
在 Supabase Dashboard 中設定允許的域名：
1. 前往 Authentication > Settings
2. 在 "Site URL" 設定你的網域
3. 在 "Additional URLs" 新增允許的重定向 URL

## 8. 監控和日誌

### 基本監控
```javascript
// lib/monitoring.js
export const trackEvent = (eventName, properties) => {
  if (process.env.NODE_ENV === 'production') {
    // 發送到分析服務
    console.log('Event:', eventName, properties)
  }
}

// 使用範例
trackEvent('task_created', { taskId: newTask.id })
trackEvent('task_completed', { taskId: task.id })
```

### 效能監控
```javascript
// lib/performance.js
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now()
    try {
      const result = await fn(...args)
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    } catch (error) {
      const end = performance.now()
      console.error(`${name} failed after ${end - start} milliseconds:`, error)
      throw error
    }
  }
}
```

## 9. 安全檢查清單

### 開發階段
- [ ] 環境變數正確設定
- [ ] 輸入驗證已實作
- [ ] 錯誤處理不暴露敏感資訊
- [ ] RLS 政策已設定
- [ ] 程式碼中沒有硬編碼的機密資訊

### 部署前
- [ ] 生產環境變數已設定
- [ ] HTTPS 已啟用
- [ ] CSP 標頭已設定
- [ ] 域名限制已設定
- [ ] 錯誤記錄已設定

### 部署後
- [ ] 功能測試通過
- [ ] 安全性測試通過
- [ ] 效能測試通過
- [ ] 監控系統正常運作

記住：安全性是一個持續的過程，需要定期檢查和更新！