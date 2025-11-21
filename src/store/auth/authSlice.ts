import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  user_id: string
  username?: string | null
  name?: string | null
  stage: number
  page: number
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isPremium: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('authToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isAdmin: false,
  isPremium: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<{ userId?: string; username?: string; name?: string; telegramInput?: string }>) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User; isAdmin: boolean; isPremium: boolean }>) => {
      state.loading = false
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isAdmin = action.payload.isAdmin
      state.isPremium = action.payload.isPremium
      localStorage.setItem('authToken', action.payload.token)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      state.isAdmin = false
      state.isPremium = false
    },
    getCurrentUserRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getCurrentUserSuccess: (state, action: PayloadAction<{ user: User; isAdmin: boolean; isPremium: boolean }>) => {
      state.loading = false
      state.user = action.payload.user
      state.isAdmin = action.payload.isAdmin
      state.isPremium = action.payload.isPremium
    },
    getCurrentUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
      // Если ошибка 401, значит токен невалиден - выходим
      if (action.payload.includes('401') || action.payload.includes('403')) {
        state.token = null
        state.isAuthenticated = false
        state.user = null
        state.isAdmin = false
        state.isPremium = false
        localStorage.removeItem('authToken')
      }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.isPremium = false
      localStorage.removeItem('authToken')
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
  clearError,
} = authSlice.actions

export default authSlice.reducer

