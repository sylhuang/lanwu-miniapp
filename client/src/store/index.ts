import { createLogger } from 'redux-logger'

import models from '../models'
import dvaCore from '../dvaCore'

const dva = dvaCore.createApp({
  initialState: {},
  models: models,
  onAction: createLogger(),
  onError(e, dispatch) {
    console.log('error ===> ', e, dispatch)
  },
})
const store = dva.getStore()

export default store
