import { takeEvery, call, put } from 'redux-saga/effects'
import {
  getFilesByYearRequest,
  getFilesByYearSuccess,
  getFilesByYearFailure,
} from './filesSlice'
import { filesService } from '../../services/filesService'

function* getFilesByYearSaga(action: ReturnType<typeof getFilesByYearRequest>) {
  try {
    const files = yield call(filesService.getFilesByYear, action.payload.yearId, action.payload.userId)
    yield put(getFilesByYearSuccess(files))
  } catch (error: any) {
    yield put(getFilesByYearFailure(error.response?.data?.error || error.message))
  }
}

export default function* filesSaga() {
  yield takeEvery(getFilesByYearRequest.type, getFilesByYearSaga)
}


