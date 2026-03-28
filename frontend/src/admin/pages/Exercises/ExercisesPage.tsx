import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { exerciseService } from '../../../services/exerciseService'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { CsvImportButton } from '../../../components/ui/CsvImportButton'
import { ExerciseFormModal } from './ExerciseFormModal'
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll'
import type { Exercise } from '../../../types/exercise'

export function ExercisesPage() {
  const { t } = useTranslation('exercises')
  const { items: exercises, isLoading, isLoadingMore, hasError, sentinelRef, reload } =
    useInfiniteScroll((page) => exerciseService.list(page))

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(undefined)

  const [deletingExercise, setDeletingExercise] = useState<Exercise | undefined>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  const [importError, setImportError] = useState<string | null>(null)

  function handleNew() {
    setEditingExercise(undefined)
    setIsFormOpen(true)
  }

  function handleEdit(exercise: Exercise) {
    setEditingExercise(exercise)
    setIsFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingExercise) return
    setIsDeleting(true)
    try {
      await exerciseService.remove(deletingExercise.id)
      setDeletingExercise(undefined)
      reload()
    } catch {
      // error handled silently — could add a toast here in the future
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <CsvImportButton
            onImport={async (file) => {
              setImportError(null)
              try {
                await exerciseService.importCsv(file)
                reload()
              } catch {
                setImportError(t('errors.import'))
              }
            }}
            label={t('import_csv')}
            loadingLabel={t('importing')}
          />
          <button
            onClick={handleNew}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            {t('new')}
          </button>
        </div>
      </div>

      {importError && <p className="text-sm text-red-500 mb-4">{importError}</p>}
      {hasError && <p className="text-sm text-red-500">{t('errors.load')}</p>}

      {!hasError && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('fields.name')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('fields.exercise_type')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('fields.muscle_groups')}</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {exercises.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                exercises.map((exercise) => (
                  <tr key={exercise.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{exercise.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {exercise.exercise_type?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscle_groups.length === 0 && <span className="text-gray-400">—</span>}
                        {exercise.muscle_groups.map((mg) => (
                          <span key={mg.id} className="px-2 py-0.5 text-xs rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                            {mg.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(exercise)}
                          className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                          title={t('actions.edit')}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingExercise(exercise)}
                          className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title={t('actions.delete')}
                        >
                          <Trash2 size={15} />
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

      <div ref={sentinelRef} />
      {isLoadingMore && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
          {t('loading_more')}
        </p>
      )}

      <ExerciseFormModal
        isOpen={isFormOpen}
        exercise={editingExercise}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false)
          reload()
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingExercise}
        title={t('confirm_delete.title')}
        message={t('confirm_delete.message', { name: deletingExercise?.name ?? '' })}
        confirmLabel={t('confirm_delete.confirm')}
        cancelLabel={t('confirm_delete.cancel')}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingExercise(undefined)}
      />
    </div>
  )
}
