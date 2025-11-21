import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Subscription, SubscriptionPrice } from '../../types'

interface SubscriptionState {
  prices: SubscriptionPrice[]
  userSubscription: Subscription | null
  loading: boolean
  error: string | null
}

const initialState: SubscriptionState = {
  prices: [],
  userSubscription: null,
  loading: false,
  error: null,
}

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
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

    // Get user subscription
    getUserSubscriptionRequest: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    getUserSubscriptionSuccess: (state, action: PayloadAction<Subscription | null>) => {
      state.loading = false
      state.userSubscription = action.payload
    },
    getUserSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Create subscription
    createSubscriptionRequest: (state, action: PayloadAction<{ userId: string; periodMonths: number }>) => {
      state.loading = true
      state.error = null
    },
    createSubscriptionSuccess: (state, action: PayloadAction<Subscription>) => {
      state.loading = false
      state.userSubscription = action.payload
    },
    createSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  getPricesRequest,
  getPricesSuccess,
  getPricesFailure,
  getUserSubscriptionRequest,
  getUserSubscriptionSuccess,
  getUserSubscriptionFailure,
  createSubscriptionRequest,
  createSubscriptionSuccess,
  createSubscriptionFailure,
  clearError,
} = subscriptionSlice.actions

export default subscriptionSlice.reducer


