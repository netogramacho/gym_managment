import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { RegisterPage } from '../pages/Register/RegisterPage'
import { WorkoutsPage } from '../pages/Workouts/WorkoutsPage'
import { WorkoutExecutionPage } from '../pages/Workouts/WorkoutExecutionPage'
import { StudentsPage } from '../pages/Students/StudentsPage'
import { adminRoutes } from '../admin/router'

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
      { path: 'workouts', element: <WorkoutsPage /> },
      { path: 'students', element: <StudentsPage /> },
    ],
  },
  {
    path: '/workouts/:id/execute',
    element: (
      <ProtectedRoute>
        <WorkoutExecutionPage />
      </ProtectedRoute>
    ),
  },
  adminRoutes,
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
