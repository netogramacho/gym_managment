import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { Topbar } from '../../../components/layout/Topbar'
import { useSidebar } from '../../../hooks/useSidebar'

export function AdminLayout() {
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
        <AdminSidebar isExpanded={isExpanded} isMobileOpen={isMobileOpen} onCloseMobile={closeMobile} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
