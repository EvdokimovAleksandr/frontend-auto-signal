import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AdminStats, AdminUser, SubscriptionPrice, TopModel, BotSetting } from '../../types'

interface AdminState {
  stats: AdminStats | null
  detailedStats: AdminStats | null
  topModels: TopModel[]
  admins: AdminUser[]
  prices: SubscriptionPrice[]
  settings: BotSetting[]
  loading: boolean
  error: string | null
}

const initialState: AdminState = {
  stats: null,
  detailedStats: null,
  topModels: [],
  admins: [],
  prices: [],
  settings: [],
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Get stats
    getStatsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getStatsSuccess: (state, action: PayloadAction<AdminStats>) => {
      state.loading = false
      state.stats = action.payload
    },
    getStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get admins
    getAdminsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getAdminsSuccess: (state, action: PayloadAction<AdminUser[]>) => {
      state.loading = false
      state.admins = action.payload
    },
    getAdminsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get prices
    getPricesRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getPricesSuccess: (state, action: PayloadAction<SubscriptionPrice[]>) => {
      state.loading = false
      state.prices = action.payload
    },
    getPricesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get detailed stats
    getDetailedStatsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getDetailedStatsSuccess: (state, action: PayloadAction<AdminStats>) => {
      state.loading = false
      state.detailedStats = action.payload
    },
    getDetailedStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get top models
    getTopModelsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getTopModelsSuccess: (state, action: PayloadAction<TopModel[]>) => {
      state.loading = false
      state.topModels = action.payload
    },
    getTopModelsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get settings
    getSettingsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getSettingsSuccess: (state, action: PayloadAction<BotSetting[]>) => {
      state.loading = false
      state.settings = action.payload
    },
    getSettingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Update start message
    updateStartMessageRequest: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    updateStartMessageSuccess: (state, action: PayloadAction<BotSetting>) => {
      state.loading = false
      const index = state.settings.findIndex(
        (s) => s.setting_key === action.payload.setting_key
      )
      if (index >= 0) {
        state.settings[index] = action.payload
      } else {
        state.settings.push(action.payload)
      }
    },
    updateStartMessageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  getStatsRequest,
  getStatsSuccess,
  getStatsFailure,
  getAdminsRequest,
  getAdminsSuccess,
  getAdminsFailure,
  getPricesRequest,
  getPricesSuccess,
  getPricesFailure,
  getDetailedStatsRequest,
  getDetailedStatsSuccess,
  getDetailedStatsFailure,
  getTopModelsRequest,
  getTopModelsSuccess,
  getTopModelsFailure,
  getSettingsRequest,
  getSettingsSuccess,
  getSettingsFailure,
  updateStartMessageRequest,
  updateStartMessageSuccess,
  updateStartMessageFailure,
  clearError,
} = adminSlice.actions

export default adminSlice.reducer



