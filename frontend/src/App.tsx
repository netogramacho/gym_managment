import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LoaderOverlay } from './components/ui/LoaderOverlay'
import router from './router'

export default function App() {
  return (
    <AuthProvider>
      <LoaderOverlay />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
