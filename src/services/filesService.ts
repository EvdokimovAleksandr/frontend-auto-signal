import apiClient from './api'
import { API_ENDPOINTS } from '@/config/api'
import type { FilesByYearResponse, FileForDescription, Brand, Model, Year } from '@/types'

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

  // Управление описаниями - получить марки
  getBrandsForDescriptions: async (page = 1, limit = 10): Promise<{
    brands: Brand[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.FILES_DESCRIPTION_BRANDS, {
      params: { page, limit },
    })
    return response.data
  },

  // Получить модели по марке для описаний
  getModelsByBrandForDescriptions: async (brandId: number): Promise<Model[]> => {
    const response = await apiClient.get<Model[]>(
      API_ENDPOINTS.FILES_DESCRIPTION_BRANDS_MODELS(brandId)
    )
    return response.data
  },

  // Получить годы по модели для описаний
  getYearsByModelForDescriptions: async (modelId: number): Promise<Year[]> => {
    const response = await apiClient.get<Year[]>(
      API_ENDPOINTS.FILES_DESCRIPTION_MODELS_YEARS(modelId)
    )
    return response.data
  },

  // Получить файлы по году для описаний
  getFilesByYearForDescriptions: async (
    yearId: number,
    filter: 'all' | 'photo' | 'pphoto' | 'pdf' | 'ppdf' = 'all'
  ): Promise<FileForDescription[]> => {
    const response = await apiClient.get<FileForDescription[]>(
      API_ENDPOINTS.FILES_DESCRIPTION_YEARS_FILES(yearId),
      { params: { filter } }
    )
    return response.data
  },

  // Обновить описание файла
  updateFileDescription: async (fileId: number, caption: string): Promise<FileForDescription> => {
    const response = await apiClient.put<FileForDescription>(
      API_ENDPOINTS.FILES_FILE_DESCRIPTION(fileId),
      { caption }
    )
    return response.data
  },

  // Добавить фото (ссылка или файл)
  addPhoto: async (urlOrFile: string | File, yearId: number): Promise<any> => {
    if (urlOrFile instanceof File) {
      const formData = new FormData()
      formData.append('file', urlOrFile)
      formData.append('yearId', String(yearId))
      const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PHOTO, formData)
      return response.data
    }
    const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PHOTO, {
      googleDriveUrl: urlOrFile,
      yearId,
    })
    return response.data
  },

  // Удалить фото
  deletePhoto: async (fileId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.FILES_DELETE_PHOTO(fileId))
  },

  // Добавить премиум фото (ссылка или файл)
  addPremiumPhoto: async (urlOrFile: string | File, yearId: number): Promise<any> => {
    if (urlOrFile instanceof File) {
      const formData = new FormData()
      formData.append('file', urlOrFile)
      formData.append('yearId', String(yearId))
      const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PREMIUM_PHOTO, formData)
      return response.data
    }
    const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PREMIUM_PHOTO, {
      googleDriveUrl: urlOrFile,
      yearId,
    })
    return response.data
  },

  // Удалить премиум фото
  deletePremiumPhoto: async (fileId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.FILES_DELETE_PREMIUM_PHOTO(fileId))
  },

  // Добавить PDF (ссылка или файл)
  addPdf: async (urlOrFile: string | File, yearId: number): Promise<any> => {
    if (urlOrFile instanceof File) {
      const formData = new FormData()
      formData.append('file', urlOrFile)
      formData.append('yearId', String(yearId))
      const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PDF, formData)
      return response.data
    }
    const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PDF, {
      googleDriveUrl: urlOrFile,
      yearId,
    })
    return response.data
  },

  // Удалить PDF
  deletePdf: async (fileId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.FILES_DELETE_PDF(fileId))
  },

  // Добавить премиум PDF (ссылка или файл)
  addPremiumPdf: async (urlOrFile: string | File, yearId: number): Promise<any> => {
    if (urlOrFile instanceof File) {
      const formData = new FormData()
      formData.append('file', urlOrFile)
      formData.append('yearId', String(yearId))
      const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PREMIUM_PDF, formData)
      return response.data
    }
    const response = await apiClient.post(API_ENDPOINTS.FILES_ADD_PREMIUM_PDF, {
      googleDriveUrl: urlOrFile,
      yearId,
    })
    return response.data
  },

  // Удалить премиум PDF
  deletePremiumPdf: async (fileId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.FILES_DELETE_PREMIUM_PDF(fileId))
  },

  // Получить файлы для предпросмотра перед удалением
  getFilesForPreview: async (yearId: number, fileType: string): Promise<any[]> => {
    const response = await apiClient.get(API_ENDPOINTS.FILES_PREVIEW(yearId, fileType))
    return response.data
  },
}
