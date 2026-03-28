import { useCallback, useEffect, useRef, useState } from 'react'
import type { PaginatedResponse } from '../types/exercise'

export function useInfiniteScroll<T>(
  fetcher: (page: number) => Promise<PaginatedResponse<T>>,
) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const pageRef = useRef(0)
  const isLoadingMoreRef = useRef(false)
  const hasMoreRef = useRef(false)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)

    fetcherRef.current(pageRef.current + 1)
      .then((res) => {
        setItems((prev) => [...prev, ...res.data])
        pageRef.current += 1
        const more = res.meta.current_page < res.meta.last_page
        hasMoreRef.current = more
        setHasMore(more)
      })
      .catch(() => {})
      .finally(() => {
        isLoadingMoreRef.current = false
        setIsLoadingMore(false)
      })
  }, [])

  useEffect(() => {
    pageRef.current = 0
    hasMoreRef.current = false
    isLoadingMoreRef.current = false
    setItems([])
    setHasMore(false)
    setHasError(false)
    setIsLoading(true)

    fetcherRef.current(1)
      .then((res) => {
        setItems(res.data)
        pageRef.current = 1
        const more = res.meta.current_page < res.meta.last_page
        hasMoreRef.current = more
        setHasMore(more)
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [reloadKey])

  useEffect(() => {
    if (isLoading || isLoadingMore) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isLoading, isLoadingMore, loadMore])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return { items, isLoading, isLoadingMore, hasMore, hasError, sentinelRef, reload }
}
