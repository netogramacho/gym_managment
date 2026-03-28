import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, value, onChange, placeholder = 'Selecione...' }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    )
  }

  function remove(optionValue: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedLabels = options.filter((o) => value.includes(o.value))

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer min-h-[38px] w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus-within:ring-2 focus-within:ring-indigo-500 flex items-center flex-wrap gap-1"
      >
        {selectedLabels.length === 0 && (
          <span className="text-gray-400 dark:text-gray-500 py-0.5">{placeholder}</span>
        )}
        {selectedLabels.map((opt) => (
          <span
            key={opt.value}
            className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md text-xs"
          >
            {opt.label}
            <button type="button" onClick={(e) => remove(opt.value, e)} className="cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-100">
              <X size={11} />
            </button>
          </span>
        ))}
        <ChevronDown
          size={15}
          className={['ml-auto shrink-0 text-gray-400 transition-transform duration-200', isOpen ? 'rotate-180' : ''].join(' ')}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto">
          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-400">Nenhuma opção disponível</p>
          )}
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={[
                'cursor-pointer px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700',
                value.includes(opt.value) ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300',
              ].join(' ')}
            >
              <span className={[
                'w-4 h-4 shrink-0 rounded border flex items-center justify-center',
                value.includes(opt.value)
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 dark:border-gray-600',
              ].join(' ')}>
                {value.includes(opt.value) && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white fill-current">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
