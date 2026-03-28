import { useAuth } from '../../../contexts/AuthContext'

export function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Backoffice
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Bem-vindo, {user?.name}.
      </p>
    </div>
  )
}
