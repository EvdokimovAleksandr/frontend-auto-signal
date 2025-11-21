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
      params: { name: query },
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
      params: { name: query, brandId },
    })
    return response.data
  },

  // Поиск годов
  searchYear: async (query: string, modelId?: number): Promise<Year[]> => {
    const response = await apiClient.get<Year[]>(API_ENDPOINTS.YEARS_SEARCH, {
      params: { year: query, modelId },
    })
    return response.data
  },

  // Добавить марки (массово)
  addBrands: async (brands: string[]): Promise<any[]> => {
    const response = await apiClient.post<any[]>(`${API_ENDPOINTS.BRANDS}/batch`, { brands })
    return response.data
  },

  // Удалить марку
  deleteBrand: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.BRANDS}/${id}`)
  },

  // Удалить марки (массово)
  deleteBrands: async (brands: string[]): Promise<any[]> => {
    const response = await apiClient.delete<any[]>(`${API_ENDPOINTS.BRANDS}/batch`, {
      data: { brands },
    })
    return response.data
  },

  // Обновить марку
  updateBrand: async (oldBrand: string, newBrand: string): Promise<Brand> => {
    const response = await apiClient.put<Brand>(API_ENDPOINTS.BRANDS, {
      oldBrand,
      newBrand,
    })
    return response.data
  },

  // Добавить модель
  addModel: async (model: string, brandId: number): Promise<Model> => {
    const response = await apiClient.post<Model>(API_ENDPOINTS.MODELS, { model, brandId })
    return response.data
  },

  // Добавить модели (массово)
  addModels: async (models: string[], brandId: number): Promise<any[]> => {
    const response = await apiClient.post<any[]>(`${API_ENDPOINTS.MODELS}/batch`, {
      models,
      brandId,
    })
    return response.data
  },

  // Удалить модели (массово)
  deleteModels: async (models: string[], brandId: number): Promise<any[]> => {
    const response = await apiClient.delete<any[]>(`${API_ENDPOINTS.MODELS}/batch`, {
      data: { models, brandId },
    })
    return response.data
  },

  // Обновить модель
  updateModel: async (oldModel: string, newModel: string, brandId: number): Promise<Model> => {
    const response = await apiClient.put<Model>(API_ENDPOINTS.MODELS, {
      oldModel,
      newModel,
      brandId,
    })
    return response.data
  },

  // Добавить годы (массово)
  addYears: async (years: string[], modelId: number): Promise<any[]> => {
    const response = await apiClient.post<any[]>(`${API_ENDPOINTS.YEARS}/batch`, {
      years,
      modelId,
    })
    return response.data
  },

  // Удалить годы (массово)
  deleteYears: async (years: string[], modelId: number): Promise<any[]> => {
    const response = await apiClient.delete<any[]>(`${API_ENDPOINTS.YEARS}/batch`, {
      data: { years, modelId },
    })
    return response.data
  },

  // Обновить год
  updateYear: async (oldYear: string, newYear: string, modelId: number): Promise<Year> => {
    const response = await apiClient.put<Year>(API_ENDPOINTS.YEARS, {
      oldYear,
      newYear,
      modelId,
    })
    return response.data
  },
}


