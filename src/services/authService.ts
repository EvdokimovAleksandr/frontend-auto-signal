import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export interface LoginRequest {
  userId?: string
  username?: string
  name?: string
  telegramInput?: string // Поддержка username или @username для автоматического получения User ID
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    user_id: string
    username?: string | null
    name?: string | null
    stage: number
    page: number
  }
  isAdmin: boolean
  isPremium: boolean
}

export interface CurrentUserResponse {
  user: {
    id: number
    user_id: string
    username?: string | null
    name?: string | null
    stage: number
    page: number
  }
  isAdmin: boolean
  isPremium: boolean
}

export const authService = {
  // Логин пользователя
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(`${API_ENDPOINTS.USERS}/login`, data)
    return response.data
  },

  // Получить текущего пользователя
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get<CurrentUserResponse>(`${API_ENDPOINTS.USERS}/me`)
    return response.data
  },
}


