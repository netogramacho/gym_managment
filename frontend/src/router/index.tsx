import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { RegisterPage } from '../pages/Register/RegisterPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
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
