import { unauthenticatedOnlyGuard } from '@/router/route-guards'

export default [
  {
    path: '/log-in/',
    name: 'LogIn',
    component: () => import(/* webpackChunkName: "log-in" */ '@/modules/log-in/_pages/LogIn'),
    meta: { secure: false, title: VUE_APP_TITLE },
    params: {
      programUuid: '',
      redirectPath: '',
    },
    beforeEnter: unauthenticatedOnlyGuard,
  },
]
