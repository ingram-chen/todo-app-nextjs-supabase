import { useState, useEffect } from 'react'
import Head from 'next/head'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { taskService } from '../lib/supabase'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // 載入任務列表
  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getAllTasks()
      setTasks(data || [])
    } catch (error) {
      console.error('載入任務失敗:', error)
      alert('載入任務失敗，請檢查網路連線或重新整理頁面')
    } finally {
      setLoading(false)
    }
  }

  // 新增任務
  const handleAddTask = async (title, description) => {
    setActionLoading(true)
    try {
      const newTask = await taskService.createTask(title, description)
      setTasks(prevTasks => [newTask, ...prevTasks])
    } catch (error) {
      console.error('新增任務失敗:', error)
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // 更新任務
  const handleUpdateTask = async (id, updates) => {
    setActionLoading(true)
    try {
      const updatedTask = await taskService.updateTask(id, updates)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? updatedTask : task
        )
      )
    } catch (error) {
      console.error('更新任務失敗:', error)
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // 刪除任務
  const handleDeleteTask = async (id) => {
    setActionLoading(true)
    try {
      await taskService.deleteTask(id)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('刪除任務失敗:', error)
      throw error
    } finally {
      setActionLoading(false)
    }
  }

  // 頁面載入時取得任務列表
  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <>
      <Head>
        <title>待辦清單 App - Next.js + Supabase</title>
        <meta name="description" content="使用 Next.js 和 Supabase 建立的待辦清單應用程式" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 頁面標題 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📝 待辦清單 App
              </h1>
              <p className="text-gray-600">
                使用 Next.js + Supabase 建立的簡單 CRUD 應用程式
              </p>
            </div>
          </div>
        </header>

        {/* 主要內容 */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 新增任務表單 */}
          <TaskForm 
            onAddTask={handleAddTask} 
            loading={actionLoading} 
          />

          {/* 任務列表 */}
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            loading={loading}
          />

          {/* 重新載入按鈕 */}
          <div className="mt-8 text-center">
            <button
              onClick={loadTasks}
              disabled={loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '載入中...' : '🔄 重新載入'}
            </button>
          </div>
        </main>

        {/* 頁尾 */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>
              使用 <span className="font-semibold">Next.js</span> + <span className="font-semibold">Supabase</span> 建立
            </p>
            <p className="text-sm mt-2">
              支援 CRUD 操作：新增、讀取、更新、刪除任務
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}