import { combineReducers } from '@reduxjs/toolkit'
import usersReducer from './users/usersSlice'
import carsReducer from './cars/carsSlice'
import subscriptionReducer from './subscription/subscriptionSlice'
import filesReducer from './files/filesSlice'
import adminReducer from './admin/adminSlice'
import authReducer from './auth/authSlice'

const rootReducer = combineReducers({
  users: usersReducer,
  cars: carsReducer,
  subscription: subscriptionReducer,
  files: filesReducer,
  admin: adminReducer,
  auth: authReducer,
})

export default rootReducer



