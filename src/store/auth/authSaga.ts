import { takeEvery, call, put } from 'redux-saga/effects'
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
} from './authSlice'
import { authService } from '../../services/authService'
import { isAuthError } from '../../services/api'

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    const response = yield call(authService.login, action.payload)
    yield put(loginSuccess({
      token: response.token,
      user: response.user,
      isAdmin: response.isAdmin,
      isPremium: response.isPremium,
    }))
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.error || error.message))
  }
}

function* getCurrentUserSaga() {
  try {
    const response = yield call(authService.getCurrentUser)
    yield put(getCurrentUserSuccess({
      user: response.user,
      isAdmin: response.isAdmin,
      isPremium: response.isPremium,
    }))
  } catch (error: any) {
    // Передаём и текст ошибки, и код статуса для правильной обработки
    const statusCode = error.response?.status
    const errorMessage = error.response?.data?.error || error.message
    
    yield put(getCurrentUserFailure({
      error: errorMessage,
      statusCode: statusCode,
    }))
  }
}

export default function* authSaga() {
  yield takeEvery(loginRequest.type, loginSaga)
  yield takeEvery(getCurrentUserRequest.type, getCurrentUserSaga)
}
