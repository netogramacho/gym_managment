import { useAuth } from '../../contexts/AuthContext'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
