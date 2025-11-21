import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { FilesByYearResponse } from '../../types'

interface FilesState {
  filesByYear: FilesByYearResponse | null
  loading: boolean
  error: string | null
}

const initialState: FilesState = {
  filesByYear: null,
  loading: false,
  error: null,
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    getFilesByYearRequest: (state, action: PayloadAction<{ yearId: number; userId?: string }>) => {
      state.loading = true
      state.error = null
    },
    getFilesByYearSuccess: (state, action: PayloadAction<FilesByYearResponse>) => {
      state.loading = false
      state.filesByYear = action.payload
    },
    getFilesByYearFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  getFilesByYearRequest,
  getFilesByYearSuccess,
  getFilesByYearFailure,
  clearError,
} = filesSlice.actions

export default filesSlice.reducer



