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
  getTopModelsRequest,
  getTopModelsSuccess,
  getTopModelsFailure,
  getSettingsRequest,
  getSettingsSuccess,
  getSettingsFailure,
  updateStartMessageRequest,
  updateStartMessageSuccess,
  updateStartMessageFailure,
} from './adminSlice'
import { adminService } from '../../services/adminService'
import { handleSagaError } from '../utils/sagaErrorHandler'

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

function* getTopModelsSaga() {
  try {
    const topModels = yield call(adminService.getTopModels)
    yield put(getTopModelsSuccess(topModels))
  } catch (error: any) {
    yield* handleSagaError(error, getTopModelsFailure)
  }
}

function* getSettingsSaga() {
  try {
    const settings = yield call(adminService.getSettings)
    yield put(getSettingsSuccess(settings))
  } catch (error: any) {
    yield* handleSagaError(error, getSettingsFailure)
  }
}

function* updateStartMessageSaga(action: any) {
  try {
    const setting = yield call(adminService.updateStartMessage, action.payload)
    yield put(updateStartMessageSuccess(setting))
  } catch (error: any) {
    yield* handleSagaError(error, updateStartMessageFailure)
  }
}

export default function* adminSaga() {
  yield takeEvery(getStatsRequest.type, getStatsSaga)
  yield takeEvery(getAdminsRequest.type, getAdminsSaga)
  yield takeEvery(getPricesRequest.type, getPricesSaga)
  yield takeEvery(getDetailedStatsRequest.type, getDetailedStatsSaga)
  yield takeEvery(getTopModelsRequest.type, getTopModelsSaga)
  yield takeEvery(getSettingsRequest.type, getSettingsSaga)
  yield takeEvery(updateStartMessageRequest.type, updateStartMessageSaga)
}
