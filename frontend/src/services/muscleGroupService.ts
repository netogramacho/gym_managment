import api from './api'
import type { MuscleGroup } from '../types/muscleGroup'
import type { PaginatedResponse } from '../types/exercise'

export const muscleGroupService = {
  async list(page = 1): Promise<PaginatedResponse<MuscleGroup>> {
    const { data } = await api.get<PaginatedResponse<MuscleGroup>>('/muscle-groups', { params: { page } })
    return data
  },

  async create(name: string): Promise<MuscleGroup> {
    const { data } = await api.post<{ data: MuscleGroup }>('/muscle-groups', { name })
    return data.data
  },

  async update(id: string, name: string): Promise<MuscleGroup> {
    const { data } = await api.put<{ data: MuscleGroup }>(`/muscle-groups/${id}`, { name })
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/muscle-groups/${id}`)
  },

  async importCsv(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)
    await api.post('/muscle-groups/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
