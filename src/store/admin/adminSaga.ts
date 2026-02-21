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

function* getStatsSaga() {
  try {
    const stats = yield call(adminService.getStats)
    yield put(getStatsSuccess(stats))
  } catch (error: any) {
    yield put(getStatsFailure(error.response?.data?.error || error.message))
  }
}

function* getAdminsSaga() {
  try {
    const admins = yield call(adminService.getAdmins)
    yield put(getAdminsSuccess(admins))
  } catch (error: any) {
    yield put(getAdminsFailure(error.response?.data?.error || error.message))
  }
}

function* getPricesSaga() {
  try {
    const prices = yield call(adminService.getPrices)
    yield put(getPricesSuccess(prices))
  } catch (error: any) {
    yield put(getPricesFailure(error.response?.data?.error || error.message))
  }
}

function* getDetailedStatsSaga() {
  try {
    const stats = yield call(adminService.getDetailedStats)
    yield put(getDetailedStatsSuccess(stats))
  } catch (error: any) {
    yield put(getDetailedStatsFailure(error.response?.data?.error || error.message))
  }
}

export default function* adminSaga() {
  yield takeEvery(getStatsRequest.type, getStatsSaga)
  yield takeEvery(getAdminsRequest.type, getAdminsSaga)
  yield takeEvery(getPricesRequest.type, getPricesSaga)
  yield takeEvery(getDetailedStatsRequest.type, getDetailedStatsSaga)
}



