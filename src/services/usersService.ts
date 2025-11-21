import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'
import type { User, RegisterUserRequest, UpdateUserRequest, PaginatedResponse } from '../types'

export const usersService = {
  // Регистрация пользователя
  registerUser: async (data: RegisterUserRequest): Promise<User> => {
    const response = await apiClient.post<User>(API_ENDPOINTS.USER_REGISTER, data)
    return response.data
  },

  // Получить пользователя по ID
  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.USER_BY_ID(userId))
    return response.data
  },

  // Обновить пользователя
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(API_ENDPOINTS.USER_BY_ID(userId), data)
    return response.data
  },

  // Получить список пользователей с пагинацией
  getUsers: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, { params })
    return response.data
  },
}



