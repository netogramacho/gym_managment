export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'trainer' | 'admin'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}
