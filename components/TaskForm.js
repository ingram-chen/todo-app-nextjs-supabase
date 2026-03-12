import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskForm({ onAddTask, loading }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 驗證輸入
    if (!title.trim()) {
      setError('請輸入任務標題')
      shakeInput()
      return
    }

    setError('')

    try {
      await onAddTask(title, description)
      // 清空表單
      setTitle('')
      setDescription('')
    } catch (err) {
      setError('新增任務失敗，請稍後再試')
    }
  }

  const shakeInput = () => {
    const input = document.getElementById('title')
    if (input) {
      input.classList.add('animate-pulse')
      setTimeout(() => input.classList.remove('animate-pulse'), 500)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
      className="card-glass mb-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">新增任務</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            任務標題 <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError('')
              }}
              placeholder="輸入任務標題..."
              className={`input-field pr-10 ${error ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : ''}`}
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-error-500 text-sm mt-2 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            任務描述 <span className="text-gray-400 font-normal">(可選)</span>
          </label>
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="新增任務描述..."
              rows={3}
              className="input-field resize-none"
              disabled={loading}
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !title.trim()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full py-3.5 px-5 rounded-xl font-semibold text-white
            bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500
            hover:from-primary-600 hover:via-primary-700 hover:to-primary-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>新增中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>新增任務</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
