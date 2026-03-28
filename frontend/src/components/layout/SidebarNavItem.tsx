import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  path: string
  label: string
  icon: React.ReactNode
  isExpanded: boolean
  onNavigate?: () => void
}

export function SidebarNavItem({ path, label, icon, isExpanded, onNavigate }: SidebarNavItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
          isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' : '',
        ].join(' ')
      }
      title={!isExpanded ? label : undefined}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate text-sm">{label}</span>
    </NavLink>
  )
}
