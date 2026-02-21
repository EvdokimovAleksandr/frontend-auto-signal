import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setLoggingOut } from '../../services/api'

// Тип пользователя
export interface AuthUser {
  id: number
  user_id: string
  username?: string | null
  name?: string | null
  first_name?: string | null
  last_name?: string | null
  stage?: number
  page?: number
  created_at?: string | null
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isPremium: boolean
  loading: boolean
  error: string | null
  // Флаг для предотвращения каскадного логаута
  isLoggingOut: boolean
}

const initialState: AuthState = {
  token: localStorage.getItem('authToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isAdmin: false,
  isPremium: false,
  loading: false,
  error: null,
  isLoggingOut: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<{ userId?: string; username?: string; name?: string; telegramInput?: string }>) => {
      state.loading = true
      state.error = null
      state.isLoggingOut = false
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: AuthUser; isAdmin: boolean; isPremium: boolean }>) => {
      state.loading = false
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isAdmin = action.payload.isAdmin
      state.isPremium = action.payload.isPremium
      state.isLoggingOut = false
      localStorage.setItem('authToken', action.payload.token)
      setLoggingOut(false)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      // НЕ сбрасываем isAuthenticated при ошибке логина - пользователь просто не смог войти
    },
    getCurrentUserRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getCurrentUserSuccess: (state, action: PayloadAction<{ user: AuthUser; isAdmin: boolean; isPremium: boolean }>) => {
      state.loading = false
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isAdmin = action.payload.isAdmin
      state.isPremium = action.payload.isPremium
      state.isLoggingOut = false
    },
    getCurrentUserFailure: (state, action: PayloadAction<{ error: string; statusCode?: number }>) => {
      state.loading = false
      state.error = action.payload.error
      
      // Логаут только при 401 (невалидный/истёкший токен)
      // НЕ логаутим при 403 - это просто нет прав, токен может быть валидным
      if (action.payload.statusCode === 401) {
        // Проверяем флаг, чтобы не было каскадного логаута
        if (!state.isLoggingOut) {
          state.isLoggingOut = true
          state.token = null
          state.isAuthenticated = false
          state.user = null
          state.isAdmin = false
          state.isPremium = false
          localStorage.removeItem('authToken')
          setLoggingOut(true)
        }
      }
    },
    // Явный логаут (по кнопке или действию пользователя)
    logout: (state) => {
      state.isLoggingOut = true
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.isPremium = false
      state.error = null
      localStorage.removeItem('authToken')
      setLoggingOut(true)
    },
    // Сброс флага логаута (после редиректа на страницу логина)
    resetLogoutFlag: (state) => {
      state.isLoggingOut = false
      setLoggingOut(false)
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  logout,
  resetLogoutFlag,
  clearError,
} = authSlice.actions

export default authSlice.reducer
