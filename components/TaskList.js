import TaskItem from './TaskItem'

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, loading }) {
  // 統計資訊
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">載入中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計資訊 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">任務統計</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-sm text-blue-800">總任務</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
            <div className="text-sm text-yellow-800">待完成</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-green-800">已完成</div>
          </div>
        </div>
      </div>

      {/* 任務列表 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">任務列表</h2>
        
        {totalTasks === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">還沒有任務</h3>
            <p className="text-gray-500">開始新增你的第一個任務吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}