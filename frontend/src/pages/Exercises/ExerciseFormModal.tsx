import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../../components/ui/Modal'
import { MultiSelect } from '../../components/ui/MultiSelect'
import { exerciseService } from '../../services/exerciseService'
import { exerciseTypeService } from '../../services/exerciseTypeService'
import { muscleGroupService } from '../../services/muscleGroupService'
import type { Exercise, ExerciseFormData } from '../../types/exercise'
import type { ExerciseType } from '../../types/exerciseType'
import type { MuscleGroup } from '../../types/muscleGroup'

interface ExerciseFormModalProps {
  isOpen: boolean
  exercise?: Exercise
  onClose: () => void
  onSuccess: (exercise: Exercise) => void
}

const EMPTY_FORM: ExerciseFormData = {
  name: '',
  description: '',
  media_url: '',
  exercise_type_id: '',
  muscle_groups: [],
}

export function ExerciseFormModal({ isOpen, exercise, onClose, onSuccess }: ExerciseFormModalProps) {
  const { t } = useTranslation('exercises')
  const [form, setForm] = useState<ExerciseFormData>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([])
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])

  useEffect(() => {
    if (!isOpen) return

    exerciseTypeService.list().then((res) => setExerciseTypes(res.data)).catch(() => {})
    muscleGroupService.list().then((res) => setMuscleGroups(res.data)).catch(() => {})

    if (exercise) {
      setForm({
        name: exercise.name,
        description: exercise.description,
        media_url: exercise.media_url ?? '',
        exercise_type_id: exercise.exercise_type_id ?? '',
        muscle_groups: exercise.muscle_groups.map((mg) => mg.id),
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError(null)
  }, [exercise, isOpen])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const payload: ExerciseFormData = {
        ...form,
        media_url: form.media_url || '',
        exercise_type_id: form.exercise_type_id || '',
      }
      const result = exercise
        ? await exerciseService.update(exercise.id, payload)
        : await exerciseService.create(payload)
      onSuccess(result)
      onClose()
    } catch {
      setError(t('errors.save'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal title={exercise ? t('edit') : t('new')} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.name')}
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.description')}
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.media_url')}
          </label>
          <input
            name="media_url"
            value={form.media_url}
            onChange={handleChange}
            type="url"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.exercise_type')}
          </label>
          <select
            name="exercise_type_id"
            value={form.exercise_type_id}
            onChange={handleChange}
            className="cursor-pointer w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t('fields.exercise_type_placeholder')}</option>
            {exerciseTypes.map((et) => (
              <option key={et.id} value={et.id}>{et.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fields.muscle_groups')}
          </label>
          <MultiSelect
            options={muscleGroups.map((mg) => ({ value: mg.id, label: mg.name }))}
            value={form.muscle_groups}
            onChange={(val) => setForm((prev) => ({ ...prev, muscle_groups: val }))}
            placeholder={t('fields.muscle_groups_placeholder')}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t('actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? t('actions.saving') : t('actions.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
