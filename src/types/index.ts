// User types
export interface User {
  user_id: string // BigInt возвращается как строка (PRIMARY KEY)
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  created_at?: string | null
}

export interface RegisterUserRequest {
  userId: string
  username?: string
  first_name?: string
  last_name?: string
}

export interface UpdateUserRequest {
  username?: string
  first_name?: string
  last_name?: string
}

// Car types
export interface Brand {
  id: number
  name: string
}

export interface Model {
  id: number
  name: string
  brand_id?: number | null
}

export interface Year {
  id: number
  value: string
  model_id?: number | null
}

// File types
export interface File {
  id: number
  name?: string | null
  path?: string | null
  is_premium?: boolean | null
  year_id?: number | null
  created_at?: string | null
  // Поля, которые бэкенд формирует динамически
  photo?: string | null
  premium_photo?: string | null
  pdf?: string | null
  premium_pdf?: string | null
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
  sub_end: string
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
  admins_count?: number
  total_files?: number
  photos_count?: number
  premium_photos_count?: number
  pdfs_count?: number
  premium_pdfs_count?: number
  files_with_descriptions?: number
  total_file_accesses?: number
  unique_users_accessed?: number
  average_accesses_per_user?: string
  new_users_last_month?: number
  new_subscriptions_last_month?: number
  subscriptions_by_period?: Record<number, number>
  average_subscription_months?: string
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

// Top Models types
export interface TopModel {
  rank: number
  brand: string
  model: string
  accessCount: number
}

// Bot Settings types
export interface BotSetting {
  id?: number
  setting_key: string
  setting_value: string
}

// File Description types
export interface FileForDescription {
  id: number
  file_type: string
  photo?: string | null
  premium_photo?: string | null
  pdf?: string | null
  premium_pdf?: string | null
  caption?: string | null
  year_id?: number | null
}


