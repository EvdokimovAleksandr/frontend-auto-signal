import { takeEvery, call, put } from 'redux-saga/effects'
import {
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
} from './usersSlice'
import { usersService } from '../../services/usersService'
import { handleSagaError } from '../utils/sagaErrorHandler'

function* registerUserSaga(action: ReturnType<typeof registerUserRequest>) {
  try {
    const user = yield call(usersService.registerUser, action.payload)
    yield put(registerUserSuccess(user))
  } catch (error: any) {
    yield* handleSagaError(error, registerUserFailure)
  }
}

function* getUserSaga(action: ReturnType<typeof getUserRequest>) {
  try {
    const user = yield call(usersService.getUser, action.payload)
    yield put(getUserSuccess(user))
  } catch (error: any) {
    yield* handleSagaError(error, getUserFailure)
  }
}

function* getUsersSaga(action: ReturnType<typeof getUsersRequest>) {
  try {
    const response = yield call(usersService.getUsers, action.payload)
    yield put(getUsersSuccess({
      users: response.users || response.data || [],
      pagination: response.pagination,
    }))
  } catch (error: any) {
    yield* handleSagaError(error, getUsersFailure)
  }
}

function* updateUserSaga(action: ReturnType<typeof updateUserRequest>) {
  try {
    const user = yield call(usersService.updateUser, action.payload.userId, action.payload.data)
    yield put(updateUserSuccess(user))
  } catch (error: any) {
    yield* handleSagaError(error, updateUserFailure)
  }
}

export default function* usersSaga() {
  yield takeEvery(registerUserRequest.type, registerUserSaga)
  yield takeEvery(getUserRequest.type, getUserSaga)
  yield takeEvery(getUsersRequest.type, getUsersSaga)
  yield takeEvery(updateUserRequest.type, updateUserSaga)
}
