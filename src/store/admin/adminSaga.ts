import { takeEvery, call, put } from 'redux-saga/effects'
import {
  getStatsRequest,
  getStatsSuccess,
  getStatsFailure,
  getAdminsRequest,
  getAdminsSuccess,
  getAdminsFailure,
  getPricesRequest,
  getPricesSuccess,
  getPricesFailure,
  getDetailedStatsRequest,
  getDetailedStatsSuccess,
  getDetailedStatsFailure,
} from './adminSlice'
import { adminService } from '@/services/adminService'
import { handleSagaError } from '@/store/utils/sagaErrorHandler'

function* getStatsSaga() {
  try {
    const stats = yield call(adminService.getStats)
    yield put(getStatsSuccess(stats))
  } catch (error: any) {
    yield* handleSagaError(error, getStatsFailure)
  }
}

function* getAdminsSaga() {
  try {
    const admins = yield call(adminService.getAdmins)
    yield put(getAdminsSuccess(admins))
  } catch (error: any) {
    yield* handleSagaError(error, getAdminsFailure)
  }
}

function* getPricesSaga() {
  try {
    const prices = yield call(adminService.getPrices)
    yield put(getPricesSuccess(prices))
  } catch (error: any) {
    yield* handleSagaError(error, getPricesFailure)
  }
}

function* getDetailedStatsSaga() {
  try {
    const stats = yield call(adminService.getDetailedStats)
    yield put(getDetailedStatsSuccess(stats))
  } catch (error: any) {
    yield* handleSagaError(error, getDetailedStatsFailure)
  }
}

export default function* adminSaga() {
  yield takeEvery(getStatsRequest.type, getStatsSaga)
  yield takeEvery(getAdminsRequest.type, getAdminsSaga)
  yield takeEvery(getPricesRequest.type, getPricesSaga)
  yield takeEvery(getDetailedStatsRequest.type, getDetailedStatsSaga)
}
