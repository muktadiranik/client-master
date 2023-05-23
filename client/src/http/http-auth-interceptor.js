import axios from 'axios'
import store from '@/stores'
import router from '../router'
import { STORE_KEY, GET_USER, RESET_STORE } from '@/stores/account/types'

export default function setup() {
  axios.defaults.baseURL = API_BASE_URL
  axios.interceptors.request.use(
    config => {
      const user = store.getters[`${STORE_KEY}/${GET_USER}`]
      const authenticated = user && user.token
      config.headers.common['x-google-analytics'] = '7997d1b49a18bd598a8764439e373242310ab92a0b68ed7205f68beb1ce72b5d'

      if (authenticated) {
        config.headers['Authorization'] = `Token ${user.token}`
      }
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )

  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response.status === 401) {
        store
          .dispatch(`${STORE_KEY}/${RESET_STORE}`)
          .then(response => {
            return response
          })
          .catch(e => {
            return Promise.reject(error.response)
          })
        router.push({ name: 'LogIn' })
      }
      if (error.response.status === 404) {
        router.push({ name: 'NotFound' })
      }
      return Promise.reject(error.response)
    }
  )
}
