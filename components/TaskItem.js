import { useState } from 'react'

export default function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [loading, setLoading] = useState(false)

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
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      task.completed ? 'border-green-500 bg-green-50' : 'border-primary-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* 完成狀態切換 */}
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-primary-500'
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* 任務內容 */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="任務描述..."
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  disabled={loading}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    儲存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mt-1 ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  建立時間: {formatDate(task.created_at)}
                  {task.updated_at !== task.created_at && (
                    <span> • 更新時間: {formatDate(task.updated_at)}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        {!isEditing && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50"
              title="編輯任務"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1 text-gray-500 hover:text-red-600 disabled:opacity-50"
              title="刪除任務"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}