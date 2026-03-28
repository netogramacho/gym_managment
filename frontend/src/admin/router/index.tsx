import { AdminProtectedRoute } from '../../components/AdminProtectedRoute'
import { AdminLayout } from '../components/layout/AdminLayout'
import { AdminDashboardPage } from '../pages/AdminDashboard/AdminDashboardPage'
import { ExercisesPage } from '../pages/Exercises/ExercisesPage'
import { ExerciseTypesPage } from '../pages/ExerciseTypes/ExerciseTypesPage'
import { MuscleGroupsPage } from '../pages/MuscleGroups/MuscleGroupsPage'

export const adminRoutes = {
  path: '/admin',
  element: (
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboardPage /> },
    { path: 'exercises', element: <ExercisesPage /> },
    { path: 'exercise-types', element: <ExerciseTypesPage /> },
    { path: 'muscle-groups', element: <MuscleGroupsPage /> },
  ],
}
