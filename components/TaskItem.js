import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [loading, setLoading] = useState(false)
  const [showActions, setShowActions] = useState(false)

  // 切換完成狀態
  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      await onUpdateTask(task.id, { completed: !task.completed })
    } catch (error) {
      alert('更新任務狀態失敗')
    } finally {
      setLoading(false)
    }
  }

  // 儲存編輯
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert('任務標題不能為空')
      return
    }

    setLoading(true)
    try {
      await onUpdateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      })
      setIsEditing(false)
    } catch (error) {
      alert('更新任務失敗')
    } finally {
      setLoading(false)
    }
  }

  // 取消編輯
  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setIsEditing(false)
  }

  // 刪除任務
  const handleDelete = async () => {
    if (!confirm('確定要刪除這個任務嗎？')) return

    setLoading(true)
    try {
      await onDeleteTask(task.id)
    } catch (error) {
      alert('刪除任務失敗')
    } finally {
      setLoading(false)
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 1)'
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 
        ${task.completed 
          ? 'border-success-200 bg-success-50/50 shadow-md hover:shadow-lg' 
          : 'border-gray-100 bg-white/80 shadow-card hover:shadow-card-hover hover:-translate-y-1'
        }`}
    >
      {/* Left status indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl 
        ${task.completed 
          ? 'bg-gradient-to-b from-success-400 to-success-600' 
          : 'bg-gradient-to-b from-primary-400 to-primary-600'
        }`} 
      />

      <div className="p-4 pl-5">
        <div className="flex items-start gap-4">
          {/* 完成狀態切換 */}
          <motion.button
            onClick={handleToggleComplete}
            disabled={loading}
            whileTap={{ scale: 0.85 }}
            className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-200 
              ${task.completed
                ? 'bg-gradient-to-br from-success-400 to-success-500 border-success-500 shadow-glow-success'
                : 'border-gray-300 hover:border-primary-500 hover:shadow-md'
              }`}
          >
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: task.completed ? 1 : 0, 
                opacity: task.completed ? 1 : 0 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </motion.svg>
          </motion.button>

          {/* 任務內容 */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    disabled={loading}
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="任務描述..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    disabled={loading}
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleSaveEdit}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white text-sm font-medium rounded-lg hover:from-success-600 hover:to-success-700 disabled:opacity-50 shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      儲存
                    </motion.button>
                    <motion.button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      取消
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className={`font-semibold text-base truncate transition-all duration-200
                    ${task.completed 
                      ? 'text-gray-500 line-through decoration-2 decoration-success-300' 
                      : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: task.completed ? 0.5 : 1, 
                        height: 'auto' 
                      }}
                      className={`text-sm mt-1.5 leading-relaxed
                        ${task.completed 
                          ? 'text-gray-400 line-through' 
                          : 'text-gray-600'
                        }`}
                    >
                      {task.description}
                    </motion.p>
                  )}
                  
                  {/* Timestamp */}
                  <div className={`flex items-center gap-4 mt-3 text-xs
                    ${task.completed ? 'text-gray-400' : 'text-gray-400'}`}
                  >
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>建立於 {formatDate(task.created_at)}</span>
                    </div>
                    {task.updated_at !== task.created_at && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>更新於 {formatDate(task.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 操作按鈕 */}
          <AnimatePresence>
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : 10 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex gap-1"
              >
                <motion.button
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="編輯任務"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  disabled={loading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  title="刪除任務"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completed celebration effect */}
      {task.completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute top-2 right-2"
        >
          <motion.svg
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-8 h-8 text-success-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </motion.svg>
        </motion.div>
      )}
    </motion.div>
  )
}
