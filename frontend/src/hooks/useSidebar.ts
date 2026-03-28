import { useState } from 'react'

const STORAGE_KEY = 'sidebar_expanded'

export function useSidebar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? stored === 'true' : true
  })

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  function toggle() {
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev)
    } else {
      setIsExpanded((prev) => {
        const next = !prev
        localStorage.setItem(STORAGE_KEY, String(next))
        return next
      })
    }
  }

  function closeMobile() {
    setIsMobileOpen(false)
  }

  return { isExpanded, isMobileOpen, toggle, closeMobile }
}
