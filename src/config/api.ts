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
  ADMIN_STATS_DETAILED: '/admin/stats/detailed',
  ADMIN_STATS_TOP_MODELS: '/admin/stats/top-models',
  ADMIN_ADMINS: '/admin/admins',
  ADMIN_PRICES: '/admin/prices',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SETTINGS_START_MESSAGE: '/admin/settings/start-message',
  ADMIN_DESCRIPTIONS: '/admin/descriptions',
  
  // Files (admin)
  FILES_DESCRIPTION_BRANDS: '/files/description-brands',
  FILES_DESCRIPTION_BRANDS_MODELS: (brandId: number) => `/files/description-brands/${brandId}/models`,
  FILES_DESCRIPTION_MODELS_YEARS: (modelId: number) => `/files/description-models/${modelId}/years`,
  FILES_DESCRIPTION_YEARS_FILES: (yearId: number) => `/files/description-years/${yearId}/files`,
  FILES_FILE_DESCRIPTION: (fileId: number) => `/files/files/${fileId}/description`,
  FILES_ADD_PHOTO: '/files/photos',
  FILES_DELETE_PHOTO: (fileId: number) => `/files/photos/${fileId}`,
  FILES_ADD_PREMIUM_PHOTO: '/files/photos/premium',
  FILES_DELETE_PREMIUM_PHOTO: (fileId: number) => `/files/photos/premium/${fileId}`,
  FILES_ADD_PDF: '/files/pdfs',
  FILES_DELETE_PDF: (fileId: number) => `/files/pdfs/${fileId}`,
  FILES_ADD_PREMIUM_PDF: '/files/pdfs/premium',
  FILES_DELETE_PREMIUM_PDF: (fileId: number) => `/files/pdfs/premium/${fileId}`,
  FILES_PREVIEW: (yearId: number, fileType: string) => `/files/years/${yearId}/files/${fileType}/preview`,
  
  // Info
  HELP: '/info/help',
} as const

