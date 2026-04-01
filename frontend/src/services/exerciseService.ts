import api from './api'
import type { Exercise, ExerciseFormData, PaginatedResponse } from '../types/exercise'

export const exerciseService = {
  async list(page = 1, perPage = 20): Promise<PaginatedResponse<Exercise>> {
    const { data } = await api.get<PaginatedResponse<Exercise>>('/exercises', { params: { page, per_page: perPage } })
    return data
  },

  async find(id: string): Promise<Exercise> {
    const { data } = await api.get<{ data: Exercise }>(`/exercises/${id}`)
    return data.data
  },

  async create(payload: ExerciseFormData): Promise<Exercise> {
    const { data } = await api.post<{ data: Exercise }>('/exercises', payload)
    return data.data
  },

  async update(id: string, payload: Partial<ExerciseFormData>): Promise<Exercise> {
    const { data } = await api.put<{ data: Exercise }>(`/exercises/${id}`, payload)
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/exercises/${id}`)
  },

  async importCsv(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)
    await api.post('/exercises/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
