import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useSidebar } from '../../hooks/useSidebar'

export function AppLayout() {
  const { isExpanded, isMobileOpen, toggle, closeMobile } = useSidebar()

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <Topbar onToggleSidebar={toggle} />
      <div className="flex flex-1 overflow-hidden">
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobile}
          />
        )}
        <Sidebar isExpanded={isExpanded} isMobileOpen={isMobileOpen} onCloseMobile={closeMobile} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
