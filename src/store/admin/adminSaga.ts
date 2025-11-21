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
} from './adminSlice'
import { adminService } from '../../services/adminService'

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

export default function* adminSaga() {
  yield takeEvery(getStatsRequest.type, getStatsSaga)
  yield takeEvery(getAdminsRequest.type, getAdminsSaga)
  yield takeEvery(getPricesRequest.type, getPricesSaga)
}



