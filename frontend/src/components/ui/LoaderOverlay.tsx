import { useSyncExternalStore } from 'react'
import { loadingStore } from '../../store/loadingStore'

export function LoaderOverlay() {
  const isLoading = useSyncExternalStore(
    loadingStore.subscribe,
    loadingStore.isLoading,
  )

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/40">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
    </div>
  )
}
