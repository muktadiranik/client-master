import Vue from 'vue'
import Router from 'vue-router'

import accountRoutes from '@/modules/account/_routes'
import accountSettingRoutes from '@/modules/account-settings/_routes'
import findingsRoutes from '@/modules/findings/_routes/'
import programRoutes from '@/modules/programs/_routes'
import publicProgramRoute from '@/modules/programs/_routes/public'
import programSettingsRoutes from '@/modules/program-settings/_routes'
import logInRoutes from '@/modules/log-in/_routes'
import signUpRoutes from '@/modules/sign-up/_routes'
import submissionRoutes from '@/modules/submissions/_routes'
import usersRoutes from '@/modules/users/_routes'
import bankRoutes from '@/modules/bank/_routes'
import reportingRoutes from '@/modules/reporting/_routes'
import { globalBeforeEachGuard } from '@/router/route-guards'
import { STORE_KEY, GET_USER } from '@/stores/account/types'
import { APPLICATION_OWNER, PROGRAM_MANAGER, RESEARCHER, BANKER } from '@/modules/core/models/user-types'
import store from '@/stores'

const routes = [
  {
    name: 'Default',
    path: '/',
    redirect: () => {
      const user = store.getters[`${STORE_KEY}/${GET_USER}`]
      switch (user.user_type) {
        case APPLICATION_OWNER:
        case PROGRAM_MANAGER:
          return { name: 'Findings' }
        case RESEARCHER:
          return { name: 'Submissions' }
        case BANKER:
          return { name: 'Transactions' }
        default:
          return { name: 'LogIn' }
      }
    },
    meta: {
      title: VUE_APP_TITLE,
    },
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/modules/not-found/NotFound.vue'),
  },
  ...accountRoutes,
  ...accountSettingRoutes,
  ...bankRoutes,
  ...findingsRoutes,
  ...programRoutes,
  ...programSettingsRoutes,
  ...submissionRoutes,
  ...logInRoutes,
  ...signUpRoutes,
  ...publicProgramRoute,
  ...usersRoutes,
  ...reportingRoutes,
]

const router = new Router({
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
})

router.beforeEach(globalBeforeEachGuard)

Vue.use(Router)

export default router
