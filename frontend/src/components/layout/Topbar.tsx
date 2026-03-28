import { Menu, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../hooks/useTheme'

interface TopbarProps {
  onToggleSidebar: () => void
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="cursor-pointer p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
          FitLog
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="cursor-pointer p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-400 pl-2">
          {user?.name}
        </span>
      </div>
    </header>
  )
}
