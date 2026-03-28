import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { ExercisesPage } from '../pages/Exercises/ExercisesPage'
import { ExerciseTypesPage } from '../pages/ExerciseTypes/ExerciseTypesPage'
import { MuscleGroupsPage } from '../pages/MuscleGroups/MuscleGroupsPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { RegisterPage } from '../pages/Register/RegisterPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'exercises', element: <ExercisesPage /> },
      { path: 'exercise-types', element: <ExerciseTypesPage /> },
      { path: 'muscle-groups', element: <MuscleGroupsPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
