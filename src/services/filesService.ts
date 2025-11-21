import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'
import type { FilesByYearResponse } from '../types'

export const filesService = {
  // Получить файлы по году
  getFilesByYear: async (yearId: number, userId?: string): Promise<FilesByYearResponse> => {
    const params = userId ? { userId } : {}
    const response = await apiClient.get<FilesByYearResponse>(
      API_ENDPOINTS.FILES_BY_YEAR(yearId),
      { params }
    )
    return response.data
  },
}


