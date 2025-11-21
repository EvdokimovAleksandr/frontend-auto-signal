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
    yield put(getCurrentUserFailure(error.response?.data?.error || error.message))
  }
}

export default function* authSaga() {
  yield takeEvery(loginRequest.type, loginSaga)
  yield takeEvery(getCurrentUserRequest.type, getCurrentUserSaga)
}

