import { useEffect, useRef, useState } from 'react'

export function useCountdown(active: boolean, seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (active) setRemaining(seconds)
  }, [active, seconds])

  useEffect(() => {
    if (!active) return
    if (remaining <= 0) {
      onDoneRef.current()
      return
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [active, remaining])

  return remaining
}
