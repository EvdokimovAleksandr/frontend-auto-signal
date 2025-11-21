import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const infoService = {
  // Получить справку
  getHelp: async (): Promise<{ help: string }> => {
    const response = await apiClient.get<{ help: string }>(API_ENDPOINTS.HELP)
    return response.data
  },
}

