// Конфигурация API
const env = import.meta.env
export const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Таймауты
export const API_TIMEOUT = 30000 // 30 секунд

// Endpoints
export const API_ENDPOINTS = {
  // Users
  USERS: '/users',
  USER_REGISTER: '/users/register',
  USER_BY_ID: (userId: string) => `/users/${userId}`,
  
  // Cars
  BRANDS: '/cars/brands',
  BRANDS_SEARCH: '/cars/brands/search',
  MODELS: '/cars/models',
  MODELS_SEARCH: '/cars/models/search',
  YEARS: '/cars/years',
  YEARS_SEARCH: '/cars/years/search',
  
  // Files
  FILES_BY_YEAR: (yearId: number) => `/files/years/${yearId}/files`,
  FILE_IMAGE: (fileId: string) => `/files/image/${fileId}`,
  
  // Subscriptions
  SUBSCRIPTION_PRICES: '/subscription/prices',
  USER_SUBSCRIPTION: (userId: string) => `/subscription/user/${userId}`,
  CREATE_SUBSCRIPTION: '/subscription/user',
  
  // Admin
  ADMIN_STATS: '/admin/stats',
  ADMIN_ADMINS: '/admin/admins',
  ADMIN_PRICES: '/admin/prices',
  
  // Info
  HELP: '/info/help',
} as const

