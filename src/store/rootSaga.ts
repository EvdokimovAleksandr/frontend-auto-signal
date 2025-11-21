import { all, fork } from 'redux-saga/effects'
import usersSaga from './users/usersSaga'
import carsSaga from './cars/carsSaga'
import subscriptionSaga from './subscription/subscriptionSaga'
import filesSaga from './files/filesSaga'
import adminSaga from './admin/adminSaga'
import authSaga from './auth/authSaga'

export default function* rootSaga() {
  yield all([
    fork(usersSaga),
    fork(carsSaga),
    fork(subscriptionSaga),
    fork(filesSaga),
    fork(adminSaga),
    fork(authSaga),
  ])
}


