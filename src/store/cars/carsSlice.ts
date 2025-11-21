import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Brand, Model, Year } from '../../types'

interface CarsState {
  brands: Brand[]
  models: Model[]
  years: Year[]
  selectedBrand: Brand | null
  selectedModel: Model | null
  loading: boolean
  error: string | null
}

const initialState: CarsState = {
  brands: [],
  models: [],
  years: [],
  selectedBrand: null,
  selectedModel: null,
  loading: false,
  error: null,
}

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    // Brands
    getBrandsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    getBrandsSuccess: (state, action: PayloadAction<Brand[]>) => {
      state.loading = false
      state.brands = action.payload
    },
    getBrandsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Models
    getModelsRequest: (state, action: PayloadAction<number>) => {
      state.loading = true
      state.error = null
    },
    getModelsSuccess: (state, action: PayloadAction<Model[]>) => {
      state.loading = false
      state.models = action.payload
    },
    getModelsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Select brand
    selectBrand: (state, action: PayloadAction<Brand>) => {
      state.selectedBrand = action.payload
      state.models = []
      state.years = []
    },

    // Select model
    selectModel: (state, action: PayloadAction<Model>) => {
      state.selectedModel = action.payload
      state.years = []
    },

    // Years
    getYearsRequest: (state, action: PayloadAction<number>) => {
      state.loading = true
      state.error = null
    },
    getYearsSuccess: (state, action: PayloadAction<Year[]>) => {
      state.loading = false
      state.years = action.payload
    },
    getYearsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Clear selections
    clearSelections: (state) => {
      state.selectedBrand = null
      state.selectedModel = null
      state.models = []
      state.years = []
    },

    // Clear only model (keep brand)
    clearModel: (state) => {
      state.selectedModel = null
      state.years = []
    },

    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  getBrandsRequest,
  getBrandsSuccess,
  getBrandsFailure,
  getModelsRequest,
  getModelsSuccess,
  getModelsFailure,
  getYearsRequest,
  getYearsSuccess,
  getYearsFailure,
  selectBrand,
  selectModel,
  clearSelections,
  clearModel,
  clearError,
} = carsSlice.actions

export default carsSlice.reducer


