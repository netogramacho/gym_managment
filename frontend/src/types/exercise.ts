import type { ExerciseType } from './exerciseType'
import type { MuscleGroup } from './muscleGroup'

export interface Exercise {
  id: string
  name: string
  description: string
  media_url: string | null
  exercise_type_id: string | null
  exercise_type: ExerciseType | null
  muscle_groups: MuscleGroup[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface ExerciseFormData {
  name: string
  description: string
  media_url: string
  exercise_type_id: string
  muscle_groups: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
