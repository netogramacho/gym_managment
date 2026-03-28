import api from './api'
import type { ExerciseType } from '../types/exerciseType'
import type { PaginatedResponse } from '../types/exercise'

export const exerciseTypeService = {
  async list(page = 1): Promise<PaginatedResponse<ExerciseType>> {
    const { data } = await api.get<PaginatedResponse<ExerciseType>>('/exercise-types', { params: { page } })
    return data
  },

  async create(name: string): Promise<ExerciseType> {
    const { data } = await api.post<{ data: ExerciseType }>('/exercise-types', { name })
    return data.data
  },

  async update(id: string, name: string): Promise<ExerciseType> {
    const { data } = await api.put<{ data: ExerciseType }>(`/exercise-types/${id}`, { name })
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/exercise-types/${id}`)
  },
}
