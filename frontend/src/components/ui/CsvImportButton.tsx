import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

interface CsvImportButtonProps {
  onImport: (file: File) => Promise<void>
  label: string
  loadingLabel: string
}

export function CsvImportButton({ onImport, label, loadingLabel }: CsvImportButtonProps) {
  const [isImporting, setIsImporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      await onImport(file)
    } finally {
      setIsImporting(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isImporting}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        <Upload size={16} />
        {isImporting ? loadingLabel : label}
      </button>
    </>
  )
}
