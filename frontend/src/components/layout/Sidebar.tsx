import { LayoutDashboard, Dumbbell, History, LogOut, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { SidebarNavItem } from './SidebarNavItem'

interface SidebarProps {
  isExpanded: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ isExpanded, isMobileOpen, onCloseMobile }: SidebarProps) {
  const { t } = useTranslation('navigation')
  const { t: tAuth } = useTranslation('auth')
  const { logout, user } = useAuth()
  const isTrainer = user?.role === 'trainer'

  return (
    <aside
      className={[
        'flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        'fixed inset-y-0 left-0 z-50 w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:static lg:inset-auto lg:z-auto lg:translate-x-0 lg:h-full',
        isExpanded ? 'lg:w-60' : 'lg:w-16',
      ].join(' ')}
    >
      <nav className="flex-1 p-3 space-y-1">
        <SidebarNavItem
          path="/"
          label={t('dashboard')}
          icon={<LayoutDashboard size={20} />}
          isExpanded={isExpanded}
          onNavigate={onCloseMobile}
        />

        <SidebarNavItem
          path="/workouts"
          label={t('workouts')}
          icon={<Dumbbell size={20} />}
          isExpanded={isExpanded}
          onNavigate={onCloseMobile}
        />

        {isTrainer && (
          <SidebarNavItem
            path="/students"
            label={t('students')}
            icon={<Users size={20} />}
            isExpanded={isExpanded}
            onNavigate={onCloseMobile}
          />
        )}

        <SidebarNavItem
          path="/history"
          label={t('history')}
          icon={<History size={20} />}
          isExpanded={isExpanded}
          onNavigate={onCloseMobile}
        />
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          title={!isExpanded ? tAuth('logout') : undefined}
          className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <span className="shrink-0">
            <LogOut size={20} />
          </span>
          <span className="text-sm lg:hidden">{tAuth('logout')}</span>
          {isExpanded && <span className="text-sm hidden lg:inline">{tAuth('logout')}</span>}
        </button>
      </div>
    </aside>
  )
}
