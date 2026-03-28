import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { exerciseTypeService } from '../../services/exerciseTypeService'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { ExerciseType } from '../../types/exerciseType'

export function ExerciseTypesPage() {
  const { t } = useTranslation('exercise_types')

  const [items, setItems] = useState<ExerciseType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<ExerciseType | undefined>(undefined)
  const [formName, setFormName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [deleting, setDeleting] = useState<ExerciseType | undefined>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await exerciseTypeService.list()
      setItems(res.data)
    } catch {
      setLoadError(t('errors.load'))
    } finally {
      setIsLoading(false)
    }
  }

  function openNew() {
    setEditing(undefined)
    setFormName('')
    setSaveError(null)
    setIsFormOpen(true)
  }

  function openEdit(item: ExerciseType) {
    setEditing(item)
    setFormName(item.name)
    setSaveError(null)
    setIsFormOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)
    try {
      const saved = editing
        ? await exerciseTypeService.update(editing.id, formName)
        : await exerciseTypeService.create(formName)
      setItems((prev) => {
        const exists = prev.find((i) => i.id === saved.id)
        return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev]
      })
      setIsFormOpen(false)
    } catch {
      setSaveError(t('errors.save'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setIsDeleting(true)
    try {
      await exerciseTypeService.remove(deleting.id)
      setItems((prev) => prev.filter((i) => i.id !== deleting.id))
      setDeleting(undefined)
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

      {loadError && <p className="text-sm text-red-500">{loadError}</p>}

      {!loadError && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('fields.name')}</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        title={editing ? t('edit') : t('new')}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('fields.name')}
            </label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {saveError && <p className="text-sm text-red-500">{saveError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
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
