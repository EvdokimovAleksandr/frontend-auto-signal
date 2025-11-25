import { takeEvery, call, put } from 'redux-saga/effects'
import {
  getPricesRequest,
  getPricesSuccess,
  getPricesFailure,
  getUserSubscriptionRequest,
  getUserSubscriptionSuccess,
  getUserSubscriptionFailure,
  createSubscriptionRequest,
  createSubscriptionSuccess,
  createSubscriptionFailure,
  deleteSubscriptionRequest,
  deleteSubscriptionSuccess,
  deleteSubscriptionFailure,
} from './subscriptionSlice'
import { subscriptionService } from '../../services/subscriptionService'
import { handleSagaError } from '../utils/sagaErrorHandler'

function* getPricesSaga() {
  try {
    const prices = yield call(subscriptionService.getPrices)
    yield put(getPricesSuccess(prices))
  } catch (error: any) {
    yield* handleSagaError(error, getPricesFailure)
  }
}

function* getUserSubscriptionSaga(action: ReturnType<typeof getUserSubscriptionRequest>) {
  try {
    const subscription = yield call(subscriptionService.getUserSubscription, action.payload)
    yield put(getUserSubscriptionSuccess(subscription))
  } catch (error: any) {
    yield* handleSagaError(error, getUserSubscriptionFailure)
  }
}

function* createSubscriptionSaga(action: ReturnType<typeof createSubscriptionRequest>) {
  try {
    const subscription = yield call(subscriptionService.createOrUpdateSubscription, {
      userId: action.payload.userId,
      periodMonths: action.payload.periodMonths,
    })
    yield put(createSubscriptionSuccess(subscription))
  } catch (error: any) {
    yield* handleSagaError(error, createSubscriptionFailure)
  }
}

function* deleteSubscriptionSaga(action: ReturnType<typeof deleteSubscriptionRequest>) {
  try {
    yield call(subscriptionService.deleteSubscription, action.payload)
    yield put(deleteSubscriptionSuccess())
  } catch (error: any) {
    yield* handleSagaError(error, deleteSubscriptionFailure)
  }
}

export default function* subscriptionSaga() {
  yield takeEvery(getPricesRequest.type, getPricesSaga)
  yield takeEvery(getUserSubscriptionRequest.type, getUserSubscriptionSaga)
  yield takeEvery(createSubscriptionRequest.type, createSubscriptionSaga)
  yield takeEvery(deleteSubscriptionRequest.type, deleteSubscriptionSaga)
}
