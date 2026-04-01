import api from './api'
import type { User } from '../types/auth'

export const trainerStudentService = {
  async list(): Promise<User[]> {
    const { data } = await api.get('/trainer/students')
    return data.data
  },

  async add(email: string): Promise<User> {
    const { data } = await api.post('/trainer/students', { email })
    return data.data
  },

  async remove(userId: string): Promise<void> {
    await api.delete(`/trainer/students/${userId}`)
  },
}
