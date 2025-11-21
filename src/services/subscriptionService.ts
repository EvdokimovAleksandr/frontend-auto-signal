import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'
import type { Subscription, SubscriptionPrice, CreateSubscriptionRequest } from '../types'

export const subscriptionService = {
  // Получить цены подписок
  getPrices: async (): Promise<SubscriptionPrice[]> => {
    const response = await apiClient.get<SubscriptionPrice[]>(API_ENDPOINTS.SUBSCRIPTION_PRICES)
    return response.data
  },

  // Получить подписку пользователя
  getUserSubscription: async (userId: string): Promise<Subscription | null> => {
    try {
      const response = await apiClient.get<Subscription>(API_ENDPOINTS.USER_SUBSCRIPTION(userId))
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // Создать или обновить подписку
  createOrUpdateSubscription: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>(API_ENDPOINTS.CREATE_SUBSCRIPTION, data)
    return response.data
  },

  // Удалить подписку
  deleteSubscription: async (userId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER_SUBSCRIPTION(userId))
  },
}


