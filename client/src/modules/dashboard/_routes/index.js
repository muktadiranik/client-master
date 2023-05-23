import store from '@/stores'
import { STORE_KEY, GET_PROFILE } from '@/stores/account/types'

export default [
  {
    path: '/dashboard/',
    name: 'Dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */
        `@/modules/dashboard/_pages/${
          store.getters[`${STORE_KEY}/${GET_PROFILE}`].user_type === 'researcher' ? 'Researcher' : 'Company'
        }Dashboard`
      ),
    meta: { secure: true, title: VUE_APP_TITLE },
  },
]
