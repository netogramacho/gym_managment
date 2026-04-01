import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ptBRAuth from './locales/pt_BR/auth.json'
import ptBRErrors from './locales/pt_BR/errors.json'
import ptBRNavigation from './locales/pt_BR/navigation.json'
import ptBRExercises from './locales/pt_BR/exercises.json'
import ptBRExerciseTypes from './locales/pt_BR/exercise_types.json'
import ptBRMuscleGroups from './locales/pt_BR/muscle_groups.json'
import ptBRWorkouts from './locales/pt_BR/workouts.json'
import ptBRStudents from './locales/pt_BR/students.json'
import enAuth from './locales/en/auth.json'
import enErrors from './locales/en/errors.json'
import enNavigation from './locales/en/navigation.json'
import enExercises from './locales/en/exercises.json'
import enExerciseTypes from './locales/en/exercise_types.json'
import enMuscleGroups from './locales/en/muscle_groups.json'
import enWorkouts from './locales/en/workouts.json'
import enStudents from './locales/en/students.json'

i18n.use(initReactI18next).init({
  lng: 'pt_BR',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    pt_BR: {
      auth: ptBRAuth,
      errors: ptBRErrors,
      navigation: ptBRNavigation,
      exercises: ptBRExercises,
      exercise_types: ptBRExerciseTypes,
      muscle_groups: ptBRMuscleGroups,
      workouts: ptBRWorkouts,
      students: ptBRStudents,
    },
    en: {
      auth: enAuth,
      errors: enErrors,
      navigation: enNavigation,
      exercises: enExercises,
      exercise_types: enExerciseTypes,
      muscle_groups: enMuscleGroups,
      workouts: enWorkouts,
      students: enStudents,
    },
  },
})

export default i18n
