import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AdminStats, AdminUser, SubscriptionPrice } from '../../types'

interface AdminState {
  stats: AdminStats | null
  admins: AdminUser[]
  prices: SubscriptionPrice[]
  loading: boolean
  error: string | null
}

const initialState: AdminState = {
  stats: null,
  admins: [],
  prices: [],
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
  clearError,
} = adminSlice.actions

export default adminSlice.reducer



