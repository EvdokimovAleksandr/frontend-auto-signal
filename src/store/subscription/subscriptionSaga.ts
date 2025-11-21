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
} from './subscriptionSlice'
import { subscriptionService } from '../../services/subscriptionService'

function* getPricesSaga() {
  try {
    const prices = yield call(subscriptionService.getPrices)
    yield put(getPricesSuccess(prices))
  } catch (error: any) {
    yield put(getPricesFailure(error.response?.data?.error || error.message))
  }
}

function* getUserSubscriptionSaga(action: ReturnType<typeof getUserSubscriptionRequest>) {
  try {
    const subscription = yield call(subscriptionService.getUserSubscription, action.payload)
    yield put(getUserSubscriptionSuccess(subscription))
  } catch (error: any) {
    yield put(getUserSubscriptionFailure(error.response?.data?.error || error.message))
  }
}

function* createSubscriptionSaga(action: ReturnType<typeof createSubscriptionRequest>) {
  try {
    const subscription = yield call(subscriptionService.createOrUpdateSubscription, action.payload)
    yield put(createSubscriptionSuccess(subscription))
  } catch (error: any) {
    yield put(createSubscriptionFailure(error.response?.data?.error || error.message))
  }
}

export default function* subscriptionSaga() {
  yield takeEvery(getPricesRequest.type, getPricesSaga)
  yield takeEvery(getUserSubscriptionRequest.type, getUserSubscriptionSaga)
  yield takeEvery(createSubscriptionRequest.type, createSubscriptionSaga)
}


