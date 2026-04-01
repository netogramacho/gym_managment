import type { Exercise } from './exercise'

export interface WorkoutExercise {
  id: string
  exercise_id: string
  exercise: Exercise
  sets: number
  reps: number
  weight: number | null
  rest_seconds: number | null
  order: number
}

export interface Workout {
  id: string
  name: string
  description: string | null
  user_id: string
  created_by: string
  is_owner: boolean
  is_creator: boolean
  exercises: WorkoutExercise[]
  created_at: string
  updated_at: string
}

export interface WorkoutExerciseFormData {
  exercise_id: string
  sets: number
  reps: number
  weight: number | null
  rest_seconds: number | null
  order: number
}

export interface WorkoutFormData {
  name: string
  description: string
  user_id: string | null
  exercises: WorkoutExerciseFormData[]
}
