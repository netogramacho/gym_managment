let count = 0
let listeners: Array<() => void> = []

function notify() {
  listeners.forEach((l) => l())
}

export const loadingStore = {
  increment() {
    count++
    notify()
  },
  decrement() {
    count = Math.max(0, count - 1)
    notify()
  },
  isLoading() {
    return count > 0
  },
  subscribe(listener: () => void) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
}
