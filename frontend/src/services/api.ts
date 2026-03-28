import axios from 'axios'
import { loadingStore } from '../store/loadingStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  loadingStore.increment()
  return config
})

api.interceptors.response.use(
  (response) => {
    loadingStore.decrement()
    return response
  },
  (error) => {
    loadingStore.decrement()
    return Promise.reject(error)
  },
)

export default api
