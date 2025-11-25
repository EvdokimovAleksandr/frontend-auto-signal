import { takeEvery, call, put } from 'redux-saga/effects'
import {
  getBrandsRequest,
  getBrandsSuccess,
  getBrandsFailure,
  getModelsRequest,
  getModelsSuccess,
  getModelsFailure,
  getYearsRequest,
  getYearsSuccess,
  getYearsFailure,
} from './carsSlice'
import { carsService } from '../../services/carsService'
import { handleSagaError } from '../utils/sagaErrorHandler'

function* getBrandsSaga() {
  try {
    const brands = yield call(carsService.getBrands)
    yield put(getBrandsSuccess(brands))
  } catch (error: any) {
    yield* handleSagaError(error, getBrandsFailure)
  }
}

function* getModelsSaga(action: ReturnType<typeof getModelsRequest>) {
  try {
    const models = yield call(carsService.getModelsByBrand, action.payload)
    yield put(getModelsSuccess(models))
  } catch (error: any) {
    yield* handleSagaError(error, getModelsFailure)
  }
}

function* getYearsSaga(action: ReturnType<typeof getYearsRequest>) {
  try {
    const years = yield call(carsService.getYearsByModel, action.payload)
    yield put(getYearsSuccess(years))
  } catch (error: any) {
    yield* handleSagaError(error, getYearsFailure)
  }
}

export default function* carsSaga() {
  yield takeEvery(getBrandsRequest.type, getBrandsSaga)
  yield takeEvery(getModelsRequest.type, getModelsSaga)
  yield takeEvery(getYearsRequest.type, getYearsSaga)
}
