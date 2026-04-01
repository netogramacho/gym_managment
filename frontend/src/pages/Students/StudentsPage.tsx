import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserMinus } from 'lucide-react'
import { trainerStudentService } from '../../services/trainerStudentService'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { User } from '../../types/auth'

export function StudentsPage() {
  const { t } = useTranslation('students')

  const [students, setStudents] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const [email, setEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const [removing, setRemoving] = useState<User | undefined>(undefined)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    trainerStudentService
      .list()
      .then(setStudents)
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)
    setAddError(null)
    try {
      const student = await trainerStudentService.add(email)
      setStudents((prev) => [...prev, student])
      setEmail('')
    } catch {
      setAddError(t('errors.add'))
    } finally {
      setIsAdding(false)
    }
  }

  async function handleRemove() {
    if (!removing) return
    setIsRemoving(true)
    try {
      await trainerStudentService.remove(removing.id)
      setStudents((prev) => prev.filter((s) => s.id !== removing.id))
      setRemoving(undefined)
    } catch {
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('title')}</h1>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('fields.email')}
          required
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isAdding}
          className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isAdding ? t('actions.adding') : t('actions.add')}
        </button>
      </form>

      {addError && <p className="text-sm text-red-500 mb-4">{addError}</p>}
      {loadError && <p className="text-sm text-red-500">{t('errors.load')}</p>}

      {!loadError && !isLoading && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {students.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                      {student.name}
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">
                        {student.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setRemoving(student)}
                          className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title={t('actions.remove')}
                        >
                          <UserMinus size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!removing}
        title={t('confirm_remove.title')}
        message={t('confirm_remove.message', { name: removing?.name ?? '' })}
        confirmLabel={t('confirm_remove.confirm')}
        cancelLabel={t('confirm_remove.cancel')}
        isLoading={isRemoving}
        onConfirm={handleRemove}
        onCancel={() => setRemoving(undefined)}
      />
    </div>
  )
}
