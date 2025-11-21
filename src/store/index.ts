import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

// Создаем saga middleware
const sagaMiddleware = createSagaMiddleware()

// Настраиваем store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Отключаем thunk, используем saga
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Игнорируем действия persist
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Запускаем root saga
sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


