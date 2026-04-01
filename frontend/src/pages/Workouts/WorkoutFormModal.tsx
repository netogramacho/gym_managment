import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../contexts/AuthContext'
import { exerciseService } from '../../services/exerciseService'
import { workoutService } from '../../services/workoutService'
import type { Exercise } from '../../types/exercise'
import type { User } from '../../types/auth'
import type { Workout, WorkoutExerciseFormData } from '../../types/workout'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editing?: Workout
  isTrainer: boolean
  students: User[]
}

const emptyExercise = (): WorkoutExerciseFormData => ({
  exercise_id: '',
  sets: 3,
  reps: 10,
  weight: null,
  rest_seconds: null,
  order: 0,
})

export function WorkoutFormModal({ isOpen, onClose, onSuccess, editing, isTrainer, students }: Props) {
  const { t } = useTranslation('workouts')
  const { user: currentUser } = useAuth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [userId, setUserId] = useState<string>('self')
  const [exercises, setExercises] = useState<WorkoutExerciseFormData[]>([emptyExercise()])
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    exerciseService.list(1, 100).then((res) => setAllExercises(res.data)).catch(() => {})
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (editing) {
      setName(editing.name)
      setDescription(editing.description ?? '')
      setUserId(editing.user_id === currentUser?.id ? 'self' : editing.user_id)
      setExercises(
        editing.exercises.map((e) => ({
          exercise_id: e.exercise_id,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          rest_seconds: e.rest_seconds,
          order: e.order,
        }))
      )
    } else {
      setName('')
      setDescription('')
      setUserId('self')
      setExercises([emptyExercise()])
    }
    setError(null)
  }, [isOpen, editing])

  function addExercise() {
    setExercises((prev) => [...prev, { ...emptyExercise(), order: prev.length }])
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index).map((e, i) => ({ ...e, order: i })))
  }

  function updateExercise(index: number, field: keyof WorkoutExerciseFormData, value: string | number | null) {
    setExercises((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validExercises = exercises.filter((ex) => ex.exercise_id !== '')
    if (validExercises.length === 0) {
      setError(t('errors.no_exercises'))
      return
    }

    setIsSaving(true)
    setError(null)

    const resolvedUserId = isTrainer && userId !== 'self' ? userId : null

    try {
      const payload = {
        name,
        description,
        user_id: resolvedUserId,
        exercises: validExercises,
      }
      editing
        ? await workoutService.update(editing.id, payload)
        : await workoutService.create(payload)
      onSuccess()
      onClose()
    } catch {
      setError(t('errors.save'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      title={editing ? t('edit') : t('new')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.name')}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.description')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {isTrainer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('fields.for_who')}
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="self">{t('fields.for_myself')}</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('fields.exercises')}
            </label>
            <button
              type="button"
              onClick={addExercise}
              className="cursor-pointer flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
            >
              <Plus size={14} />
              {t('fields.add_exercise')}
            </button>
          </div>

          <div className="space-y-3">
            {exercises.map((ex, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <select
                      value={ex.exercise_id}
                      onChange={(e) => updateExercise(index, 'exercise_id', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">{t('fields.exercise_placeholder')}</option>
                      {allExercises.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('fields.sets')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={ex.sets}
                      onChange={(e) => updateExercise(index, 'sets', Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('fields.reps')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={ex.reps}
                      onChange={(e) => updateExercise(index, 'reps', Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('fields.weight')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={ex.weight ?? ''}
                      onChange={(e) =>
                        updateExercise(index, 'weight', e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('fields.rest')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={ex.rest_seconds ?? ''}
                      onChange={(e) =>
                        updateExercise(index, 'rest_seconds', e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t('actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? t('actions.saving') : t('actions.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
