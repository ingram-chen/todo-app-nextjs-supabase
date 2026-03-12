import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { taskService } from '../lib/supabase'

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
}

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

      <div className="min-h-screen relative">
        {/* Decorative background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl" />
        </div>

        {/* 頁面標題 */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50"
        >
          <div className="container-app py-6">
            <div className="text-center">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-4xl sm:text-5xl font-extrabold mb-3"
              >
                <span className="text-gradient">📝 待辦清單</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-sm sm:text-base max-w-md mx-auto"
              >
                使用 <span className="font-semibold text-primary-600">Next.js</span> + <span className="font-semibold text-secondary-600">Supabase</span> 打造的精美待辦應用
              </motion.p>
            </div>
          </div>
        </motion.header>

        {/* 主要內容 */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative container-app py-8"
        >
          {/* 新增任務表單 */}
          <motion.div variants={itemVariants}>
            <TaskForm 
              onAddTask={handleAddTask} 
              loading={actionLoading} 
            />
          </motion.div>

          {/* 任務列表 */}
          <motion.div variants={itemVariants}>
            <TaskList
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              loading={loading}
            />
          </motion.div>

          {/* 重新載入按鈕 */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <motion.button
              onClick={loadTasks}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <svg 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? '載入中...' : '重新載入'}
            </motion.button>
          </motion.div>
        </motion.main>

        {/* 頁尾 */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16"
        >
          <div className="container-app py-6 text-center">
            <p className="text-gray-500 text-sm">
              Powered by <span className="font-semibold text-primary-600">Next.js</span> + <span className="font-semibold text-secondary-600">Supabase</span>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              支援 CRUD 操作：新增、讀取、更新、刪除任務
            </p>
          </div>
        </motion.footer>
      </div>
    </>
  )
}
