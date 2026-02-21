import { put, select } from 'redux-saga/effects'
import { logout } from '../auth/authSlice'
import { isAuthError } from '../../services/api'

// Селектор для проверки, не идёт ли уже логаут
const selectIsLoggingOut = (state: any) => state.auth.isLoggingOut

/**
 * Обработчик ошибок для саг
 * - При 401 (невалидный токен) - логаут
 * - При остальных ошибках - вызов failureAction
 */
export function* handleSagaError(error: any, failureAction: (message: string) => any) {
  const isLoggingOut: boolean = yield select(selectIsLoggingOut)
  
  // Если получили 401 и ещё не в процессе логаута - разлогиниваем
  if (isAuthError(error) && !isLoggingOut) {
    yield put(logout())
    return true // Возвращаем true чтобы сага знала, что был логаут
  }
  
  // Для остальных ошибок - просто показываем ошибку
  const errorMessage = error.response?.data?.error || error.message || 'Неизвестная ошибка'
  yield put(failureAction(errorMessage))
  return false
}

