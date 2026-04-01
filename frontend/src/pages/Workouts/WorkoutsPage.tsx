import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Plus, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { workoutService } from '../../services/workoutService'
import { trainerStudentService } from '../../services/trainerStudentService'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { WorkoutFormModal } from './WorkoutFormModal'
import type { Workout } from '../../types/workout'
import type { User } from '../../types/auth'

export function WorkoutsPage() {
  const { t } = useTranslation('workouts')
  const { user } = useAuth()
  const navigate = useNavigate()
  const isTrainer = user?.role === 'trainer'

  const { items, isLoading, isLoadingMore, hasError, sentinelRef, reload } =
    useInfiniteScroll((page) => workoutService.list(page))

  const [students, setStudents] = useState<User[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Workout | undefined>(undefined)
  const [deleting, setDeleting] = useState<Workout | undefined>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isTrainer) return
    trainerStudentService.list().then(setStudents).catch(() => {})
  }, [isTrainer])

  function openNew() {
    setEditing(undefined)
    setIsFormOpen(true)
  }

  function openEdit(item: Workout) {
    setEditing(item)
    setIsFormOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return
    setIsDeleting(true)
    try {
      await workoutService.remove(deleting.id)
      setDeleting(undefined)
      reload()
    } catch {
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('title')}</h1>
        <button
          onClick={openNew}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          {t('new')}
        </button>
      </div>

      {hasError && <p className="text-sm text-red-500">{t('errors.load')}</p>}

      {!hasError && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('fields.name')}</th>
                {isTrainer && (
                  <th className="px-4 py-3 text-left font-medium">{t('fields.for_who')}</th>
                )}
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan={isTrainer ? 3 : 2}
                    className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500"
                  >
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                      {item.name}
                      {item.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>
                    {isTrainer && (
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {item.is_owner
                          ? t('fields.for_myself')
                          : (students.find((s) => s.id === item.user_id)?.name ?? item.user_id)}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => navigate(`/workouts/${item.id}/execute`)}
                          className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                          title={t('actions.start')}
                        >
                          <Play size={15} />
                        </button>
                        {(item.is_creator || item.is_owner) && (
                          <>
                            <button
                              onClick={() => openEdit(item)}
                              className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                              title={t('actions.edit')}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleting(item)}
                              className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                              title={t('actions.delete')}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
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

      <WorkoutFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={reload}
        editing={editing}
        isTrainer={isTrainer}
        students={students}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        title={t('confirm_delete.title')}
        message={t('confirm_delete.message', { name: deleting?.name ?? '' })}
        confirmLabel={t('confirm_delete.confirm')}
        cancelLabel={t('confirm_delete.cancel')}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
