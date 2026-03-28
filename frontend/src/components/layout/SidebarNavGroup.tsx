import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { SidebarNavItem } from './SidebarNavItem'

interface SubItem {
  path: string
  label: string
}

interface SidebarNavGroupProps {
  label: string
  icon: React.ReactNode
  items: SubItem[]
  isExpanded: boolean
  onNavigate?: () => void
}

export function SidebarNavGroup({ label, icon, items, isExpanded, onNavigate }: SidebarNavGroupProps) {
  const { pathname } = useLocation()
  const isChildActive = items.some((item) => item.path === pathname)

  const [isOpen, setIsOpen] = useState(isChildActive)

  useEffect(() => {
    if (isChildActive) setIsOpen(true)
  }, [isChildActive])

  if (!isExpanded) {
    return (
      <div
        className="flex items-center justify-center px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400"
        title={label}
      >
        <span className="shrink-0">{icon}</span>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          'cursor-pointer flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors',
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
          isChildActive ? 'text-gray-900 dark:text-white font-medium' : '',
        ].join(' ')}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 truncate text-sm text-left">{label}</span>
        <ChevronDown
          size={15}
          className={['transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')}
        />
      </button>

      {isOpen && (
        <div className="mt-1 ml-4 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-1">
          {items.map((item) => (
            <SidebarNavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={null}
              isExpanded={true}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
