import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'
import type { AdminStats, AdminUser, SubscriptionPrice, TopModel, BotSetting } from '../types'

export const adminService = {
  // Получить статистику
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN_STATS)
    return response.data
  },

  // Получить детальную статистику
  getDetailedStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN_STATS_DETAILED)
    return response.data
  },

  // Получить топ-20 моделей
  getTopModels: async (): Promise<TopModel[]> => {
    const response = await apiClient.get<TopModel[]>(API_ENDPOINTS.ADMIN_STATS_TOP_MODELS)
    return response.data
  },

  // Получить список администраторов
  getAdmins: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get<AdminUser[]>(`${API_ENDPOINTS.ADMIN_ADMINS}/list`)
    return response.data
  },

  // Добавить администратора
  addAdmin: async (userIdOrUsername: string): Promise<AdminUser> => {
    // Поддерживаем как userId, так и username
    const response = await apiClient.post<AdminUser>(API_ENDPOINTS.ADMIN_ADMINS, {
      user_id: userIdOrUsername,
      username: userIdOrUsername.startsWith('@') ? userIdOrUsername.slice(1) : undefined,
    })
    return response.data
  },

  // Удалить администратора
  removeAdmin: async (userId: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ADMIN_ADMINS}/${userId}`)
  },

  // Получить цены подписок (админ)
  getPrices: async (): Promise<SubscriptionPrice[]> => {
    const response = await apiClient.get<SubscriptionPrice[]>(API_ENDPOINTS.ADMIN_PRICES)
    return response.data
  },

  // Обновить цену подписки
  updatePrice: async (periodMonths: number, priceKopecks: number): Promise<SubscriptionPrice> => {
    const response = await apiClient.put<SubscriptionPrice>(
      `${API_ENDPOINTS.ADMIN_PRICES}/${periodMonths}`,
      { price_rub: priceKopecks / 100 }
    )
    return {
      ...response.data,
      price_kopecks: priceKopecks,
    }
  },

  // Получить настройки бота
  getSettings: async (): Promise<BotSetting[]> => {
    const response = await apiClient.get<BotSetting[]>(API_ENDPOINTS.ADMIN_SETTINGS)
    return response.data
  },

  // Обновить стартовое сообщение
  updateStartMessage: async (message: string): Promise<BotSetting> => {
    const response = await apiClient.put<BotSetting>(API_ENDPOINTS.ADMIN_SETTINGS_START_MESSAGE, {
      message,
    })
    return response.data
  },
}


