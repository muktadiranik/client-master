import { unauthenticatedOnlyGuard } from '@/router/route-guards'

export default [
  {
    path: '/confirm/:code?',
    name: 'Confirm',
    component: () => import(/* webpackChunkName: "account-confirm" */ '@/modules/account/_pages/Confirm'),
    meta: { secure: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
  {
    path: '/account/recovery',
    name: 'RecoveryRequest',
    component: () => import(/* webpackChunkName: "recovery-request" */ '@/modules/account/_pages/RecoveryRequest'),
    meta: { secure: false, approval: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
  {
    path: '/account/recovery/:token?',
    name: 'Recovery',
    component: () => import(/* webpackChunkName: "recovery" */ '@/modules/account/_pages/Recovery'),
    meta: { secure: false, approval: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
]
