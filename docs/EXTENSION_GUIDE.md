# 功能擴展指南

## 1. 使用者認證系統

### 新增認證功能
建立認證相關元件和頁面：

```javascript
// components/AuthForm.js
import { useState } from 'react'
import { authService } from '../lib/auth'

export default function AuthForm({ mode = 'login', onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'login') {
        await authService.signIn(email, password)
      } else {
        await authService.signUp(email, password)
      }
      onSuccess?.()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          電子郵件
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          密碼
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '處理中...' : (mode === 'login' ? '登入' : '註冊')}
      </button>
    </form>
  )
}
```

### 更新主應用程式
```javascript
// pages/index.js 新增認證邏輯
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AuthForm from '../components/AuthForm'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 檢查使用者登入狀態
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>載入中...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">
            待辦清單 App
          </h1>
          <AuthForm onSuccess={() => window.location.reload()} />
        </div>
      </div>
    )
  }

  // 原本的應用程式內容...
}
```

## 2. 任務分類功能

### 新增分類資料表
```sql
-- 建立分類表
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更新任務表
ALTER TABLE tasks ADD COLUMN category_id BIGINT REFERENCES categories(id);

-- RLS 政策
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);
```

### 分類管理元件
```javascript
// components/CategoryManager.js
import { useState, useEffect } from 'react'
import { categoryService } from '../lib/supabase'

export default function CategoryManager({ onCategoryChange }) {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'
  ]

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      const newCategory = await categoryService.createCategory(
        newCategoryName,
        selectedColor
      )
      setCategories([...categories, newCategory])
      setNewCategoryName('')
      onCategoryChange?.()
    } catch (error) {
      alert('新增分類失敗')
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">任務分類</h3>
      
      <form onSubmit={handleAddCategory} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="分類名稱"
            className="input-field flex-1"
          />
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="input-field w-20"
          >
            {colors.map(color => (
              <option key={color} value={color} style={{ backgroundColor: color }}>
                ●
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            新增
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {categories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 rounded"
            style={{ backgroundColor: category.color + '20' }}
          >
            <span style={{ color: category.color }}>
              ● {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 3. 任務優先級

### 更新資料表
```sql
-- 新增優先級欄位
ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 1;
-- 1: 低, 2: 中, 3: 高, 4: 緊急

-- 新增索引提升查詢效能
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

### 優先級元件
```javascript
// components/PriorityBadge.js
export default function PriorityBadge({ priority, onChange, editable = false }) {
  const priorities = [
    { value: 1, label: '低', color: 'bg-gray-100 text-gray-800' },
    { value: 2, label: '中', color: 'bg-blue-100 text-blue-800' },
    { value: 3, label: '高', color: 'bg-yellow-100 text-yellow-800' },
    { value: 4, label: '緊急', color: 'bg-red-100 text-red-800' }
  ]

  const currentPriority = priorities.find(p => p.value === priority) || priorities[0]

  if (editable) {
    return (
      <select
        value={priority}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="text-xs rounded px-2 py-1 border"
      >
        {priorities.map(p => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${currentPriority.color}`}>
      {currentPriority.label}
    </span>
  )
}
```

## 4. 任務搜尋和篩選

### 搜尋元件
```javascript
// components/TaskFilter.js
import { useState } from 'react'

export default function TaskFilter({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const handleFilterChange = () => {
    onFilterChange({
      searchTerm,
      status: statusFilter,
      priority: priorityFilter
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">篩選任務</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            搜尋
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              handleFilterChange()
            }}
            placeholder="搜尋任務..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            狀態
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              handleFilterChange()
            }}
            className="input-field"
          >
            <option value="all">全部</option>
            <option value="pending">待完成</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            優先級
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              handleFilterChange()
            }}
            className="input-field"
          >
            <option value="all">全部</option>
            <option value="4">緊急</option>
            <option value="3">高</option>
            <option value="2">中</option>
            <option value="1">低</option>
          </select>
        </div>
      </div>
    </div>
  )
}
```

### 篩選邏輯
```javascript
// lib/taskFilters.js
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // 搜尋篩選
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      
      if (!matchesSearch) return false
    }

    // 狀態篩選
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !task.completed) return false
      if (filters.status === 'pending' && task.completed) return false
    }

    // 優先級篩選
    if (filters.priority !== 'all') {
      if (task.priority !== parseInt(filters.priority)) return false
    }

    return true
  })
}

export const sortTasks = (tasks, sortBy = 'created_at', sortOrder = 'desc') => {
  return [...tasks].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    // 特殊處理日期
    if (sortBy.includes('_at')) {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}
```

## 5. 任務到期提醒

### 更新資料表
```sql
-- 新增到期日欄位
ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;

-- 建立索引
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### 到期提醒元件
```javascript
// components/DueDatePicker.js
export default function DueDatePicker({ value, onChange, disabled }) {
  const formatDateForInput = (date) => {
    if (!date) return ''
    return new Date(date).toISOString().slice(0, 16)
  }

  const handleDateChange = (e) => {
    const dateValue = e.target.value
    onChange(dateValue ? new Date(dateValue).toISOString() : null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        到期日
      </label>
      <input
        type="datetime-local"
        value={formatDateForInput(value)}
        onChange={handleDateChange}
        disabled={disabled}
        className="input-field"
      />
    </div>
  )
}
```

### 到期提醒邏輯
```javascript
// lib/notifications.js
export const checkOverdueTasks = (tasks) => {
  const now = new Date()
  const overdueTasks = tasks.filter(task => 
    !task.completed && 
    task.due_date && 
    new Date(task.due_date) < now
  )

  const dueSoonTasks = tasks.filter(task => {
    if (task.completed || !task.due_date) return false
    
    const dueDate = new Date(task.due_date)
    const timeDiff = dueDate - now
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    return hoursDiff > 0 && hoursDiff <= 24 // 24小時內到期
  })

  return { overdueTasks, dueSoonTasks }
}

export const showNotifications = (overdueTasks, dueSoonTasks) => {
  if (overdueTasks.length > 0) {
    console.log(`你有 ${overdueTasks.length} 個逾期任務`)
  }
  
  if (dueSoonTasks.length > 0) {
    console.log(`你有 ${dueSoonTasks.length} 個任務即將到期`)
  }
}
```

## 6. 資料匯出功能

### CSV 匯出
```javascript
// lib/export.js
export const exportTasksToCSV = (tasks) => {
  const headers = ['標題', '描述', '狀態', '優先級', '建立時間', '到期時間']
  
  const csvContent = [
    headers.join(','),
    ...tasks.map(task => [
      `"${task.title}"`,
      `"${task.description || ''}"`,
      task.completed ? '已完成' : '待完成',
      getPriorityLabel(task.priority),
      formatDate(task.created_at),
      task.due_date ? formatDate(task.due_date) : ''
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tasks_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const getPriorityLabel = (priority) => {
  const labels = { 1: '低', 2: '中', 3: '高', 4: '緊急' }
  return labels[priority] || '低'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-TW')
}
```

## 7. 效能優化

### 虛擬滾動（大量任務）
```javascript
// components/VirtualTaskList.js
import { FixedSizeList as List } from 'react-window'

export default function VirtualTaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TaskItem
        task={tasks[index]}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### 分頁載入
```javascript
// lib/pagination.js
export const usePagination = (pageSize = 20) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const loadPage = async (page = 1) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    setTotalCount(count)
    setCurrentPage(page)
    return data
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    currentPage,
    totalPages,
    totalCount,
    loadPage,
    setCurrentPage
  }
}
```

這些擴展功能可以讓你的待辦清單應用程式更加完整和實用！