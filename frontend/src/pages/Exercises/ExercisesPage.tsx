import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { exerciseService } from '../../services/exerciseService'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ExerciseFormModal } from './ExerciseFormModal'
import type { Exercise } from '../../types/exercise'

export function ExercisesPage() {
  const { t } = useTranslation('exercises')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(undefined)

  const [deletingExercise, setDeletingExercise] = useState<Exercise | undefined>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchExercises()
  }, [])

  async function fetchExercises() {
    setIsLoadingList(true)
    setLoadError(null)
    try {
      const response = await exerciseService.list()
      setExercises(response.data)
    } catch {
      setLoadError(t('errors.load'))
    } finally {
      setIsLoadingList(false)
    }
  }

  function handleNew() {
    setEditingExercise(undefined)
    setIsFormOpen(true)
  }

  function handleEdit(exercise: Exercise) {
    setEditingExercise(exercise)
    setIsFormOpen(true)
  }

  function handleFormSuccess(saved: Exercise) {
    setExercises((prev) => {
      const exists = prev.find((e) => e.id === saved.id)
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...prev]
    })
  }

  async function handleConfirmDelete() {
    if (!deletingExercise) return
    setIsDeleting(true)
    try {
      await exerciseService.remove(deletingExercise.id)
      setExercises((prev) => prev.filter((e) => e.id !== deletingExercise.id))
      setDeletingExercise(undefined)
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
        {isAdmin && (
          <button
            onClick={handleNew}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            {t('new')}
          </button>
        )}
      </div>

      {loadError && <p className="text-sm text-red-500">{loadError}</p>}

      {!loadError && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('fields.name')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('fields.exercise_type')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('fields.muscle_groups')}</th>
                {isAdmin && <th className="px-4 py-3 w-20" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {exercises.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
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
                    {isAdmin && (
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
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ExerciseFormModal
        isOpen={isFormOpen}
        exercise={editingExercise}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
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
