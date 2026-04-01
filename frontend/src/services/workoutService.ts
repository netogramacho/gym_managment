import api from './api'
import type { Workout, WorkoutFormData } from '../types/workout'
import type { PaginatedResponse } from '../types/exercise'

export const workoutService = {
  async list(page = 1): Promise<PaginatedResponse<Workout>> {
    const { data } = await api.get('/workouts', { params: { page } })
    return data
  },

  async create(payload: WorkoutFormData): Promise<Workout> {
    const { data } = await api.post('/workouts', payload)
    return data.data
  },

  async update(id: string, payload: Partial<WorkoutFormData>): Promise<Workout> {
    const { data } = await api.put(`/workouts/${id}`, payload)
    return data.data
  },

  async find(id: string): Promise<Workout> {
    const { data } = await api.get(`/workouts/${id}`)
    return data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/workouts/${id}`)
  },
}
