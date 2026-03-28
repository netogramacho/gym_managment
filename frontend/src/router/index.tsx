import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { ExercisesPage } from '../pages/Exercises/ExercisesPage'
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
