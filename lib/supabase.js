import { createClient } from '@supabase/supabase-js'

// Supabase 設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 檢查環境變數是否存在
if (!supabaseUrl || !supabaseKey) {
  throw new Error('請確認 Supabase URL 和 API Key 已正確設定在環境變數中')
}

// 建立 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseKey)

// 任務相關的資料庫操作函數
export const taskService = {
  // 取得所有任務
  async getAllTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('取得任務失敗:', error)
      throw error
    }
  },

  // 新增任務
  async createTask(title, description = '') {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: title.trim(),
            description: description.trim(),
            completed: false
          }
        ])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('新增任務失敗:', error)
      throw error
    }
  },

  // 更新任務
  async updateTask(id, updates) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('更新任務失敗:', error)
      throw error
    }
  },

  // 切換任務完成狀態
  async toggleTaskComplete(id, completed) {
    return this.updateTask(id, { completed })
  },

  // 刪除任務
  async deleteTask(id) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('刪除任務失敗:', error)
      throw error
    }
  }
}