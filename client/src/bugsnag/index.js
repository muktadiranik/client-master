import bugsnag from 'bugsnag-js'
import store from '@/stores'
import { STORE_KEY, GET_USER } from '@/stores/account/types'

const metaData = () => {
  const user = store.getters[`${STORE_KEY}/${GET_USER}`]

  const data = {
    user: {
      authenticated: user && user.token,
      userType: user ? user.user_type : 'N/A',
    },
  }

  return data
}

const bugsnagClient = bugsnag({
  apiKey: BUGSNAG_CLIENT_KEY,
  releaseStage: process.env.NODE_ENV,
  beforeSend: report => {
    const env = process.env.NODE_ENV
    if (env === 'development') {
      return false
    }
  },
  metaData: metaData(),
})

export default bugsnagClient
