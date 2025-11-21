// User types
export interface User {
  id: number
  user_id: string // BigInt возвращается как строка
  username?: string | null
  name?: string | null
  created_at?: string | null
  stage: number
  page: number
}

export interface RegisterUserRequest {
  userId: string
  username?: string
  name?: string
}

export interface UpdateUserRequest {
  username?: string
  name?: string
  stage?: number
  page?: number
}

// Car types
export interface Brand {
  id: number
  brand: string
}

export interface Model {
  id: number
  model: string
  brand_id?: number | null
  brand?: string | null
}

export interface Year {
  id: number
  year: string
  model_id?: number | null
  brand?: string | null
  model?: string | null
}

// File types
export interface File {
  id: number
  photo?: string | null
  pdf?: string | null
  premium_photo?: string | null
  premium_pdf?: string | null
  year_id?: number | null
  year?: string | null
  model?: string | null
  brand?: string | null
  caption?: string | null
}

export interface FilesByYearResponse {
  year: string
  model: string
  brand: string
  files: File[]
}

// Subscription types
export interface Subscription {
  id: number
  user_id: string
  sub_start: string
  sub_end: string
  status: string
  period_months?: number | null
}

export interface SubscriptionPrice {
  id?: number
  period_months: number
  price_kopecks?: number
  price_rub?: number
  period_text?: string
  created_at?: string | null
}

export interface CreateSubscriptionRequest {
  userId: string
  periodMonths: number
}

// Admin types
export interface AdminStats {
  total_users: number
  premium_users: number
  regular_users: number
  brands_count: number
  models_count: number
  years_count: number
}

export interface AdminUser {
  id: number
  user_id: string
  username?: string | null
  added_by?: string | null
  added_at?: string | null
  is_super_admin?: boolean | null
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  users?: T[]
  data?: T[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// API Error types
export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}


