import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import type { User, LoginPayload, RegisterPayload } from '../types/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }

    authService
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(payload: LoginPayload): Promise<User> {
    const { token, user } = await authService.login(payload)
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  async function register(payload: RegisterPayload): Promise<User> {
    const { token, user } = await authService.register(payload)
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  async function logout() {
    await authService.logout()
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
