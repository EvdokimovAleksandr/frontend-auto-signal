import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types'

interface UsersState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  } | null
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Register user
    registerUserRequest: (state, action: PayloadAction<{ userId: string; username?: string; name?: string }>) => {
      state.loading = true
      state.error = null
    },
    registerUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.currentUser = action.payload
    },
    registerUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get user
    getUserRequest: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    getUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.currentUser = action.payload
    },
    getUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Get users list
    getUsersRequest: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      state.loading = true
      state.error = null
    },
    getUsersSuccess: (state, action: PayloadAction<{ users: User[]; pagination: any }>) => {
      state.loading = false
      state.users = action.payload.users
      state.pagination = action.payload.pagination
    },
    getUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Update user
    updateUserRequest: (state, action: PayloadAction<{ userId: string; data: any }>) => {
      state.loading = true
      state.error = null
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.currentUser = action.payload
      const index = state.users.findIndex((u) => u.user_id === action.payload.user_id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  registerUserRequest,
  registerUserSuccess,
  registerUserFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  clearError,
} = usersSlice.actions

export default usersSlice.reducer


