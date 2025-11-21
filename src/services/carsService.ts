import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'
import type { Brand, Model, Year } from '../types'

export const carsService = {
  // Получить все марки
  getBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<Brand[]>(API_ENDPOINTS.BRANDS)
    return response.data
  },

  // Добавить марки (требует админ токен)
  addBrands: async (brands: string[]): Promise<Brand[]> => {
    const response = await apiClient.post<Brand[]>(API_ENDPOINTS.BRANDS, { brands })
    return response.data
  },

  // Удалить марку (требует админ токен)
  deleteBrand: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.BRANDS}/${id}`)
  },

  // Поиск марок
  searchBrand: async (query: string): Promise<Brand[]> => {
    const response = await apiClient.get<Brand[]>(API_ENDPOINTS.BRANDS_SEARCH, {
      params: { q: query },
    })
    return response.data
  },

  // Получить модели по марке
  getModelsByBrand: async (brandId: number): Promise<Model[]> => {
    const response = await apiClient.get<Model[]>(API_ENDPOINTS.MODELS, {
      params: { brandId },
    })
    return response.data
  },

  // Получить годы по модели
  getYearsByModel: async (modelId: number): Promise<Year[]> => {
    const response = await apiClient.get<Year[]>(API_ENDPOINTS.YEARS, {
      params: { modelId },
    })
    return response.data
  },

  // Добавить модель (требует админ токен)
  addModel: async (model: string, brandId: number): Promise<Model> => {
    const response = await apiClient.post<Model>(API_ENDPOINTS.MODELS, { model, brandId })
    return response.data
  },

  // Поиск моделей
  searchModel: async (query: string, brandId?: number): Promise<Model[]> => {
    const response = await apiClient.get<Model[]>(API_ENDPOINTS.MODELS_SEARCH, {
      params: { q: query, brandId },
    })
    return response.data
  },

  // Поиск годов
  searchYear: async (query: string, modelId?: number): Promise<Year[]> => {
    const response = await apiClient.get<Year[]>(API_ENDPOINTS.YEARS_SEARCH, {
      params: { q: query, modelId },
    })
    return response.data
  },
}


