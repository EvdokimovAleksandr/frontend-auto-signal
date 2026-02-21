import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/config/api'

// Флаг для предотвращения каскадного логаута
let isLoggingOut = false

// Создаем экземпляр axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    // Если уже в процессе логаута - не добавляем токен
    if (isLoggingOut) {
      return config
    }
    
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData && config.headers) {
      delete (config.headers as Record<string, unknown>)['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
// НЕ делаем автоматический логаут здесь - это будет обрабатываться в Redux
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Ошибка пробрасывается дальше, логика логаута при 401 — в Redux saga
    return Promise.reject(error)
  }
)

// Функция для установки флага логаута (вызывается из authSlice)
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value
}

// Функция для проверки, является ли ошибка ошибкой авторизации
export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401
}

// Функция для проверки, является ли ошибка ошибкой доступа (не админ)
export const isForbiddenError = (error: any): boolean => {
  return error?.response?.status === 403
}

export default apiClient
