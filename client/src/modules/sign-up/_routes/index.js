import { unauthenticatedOnlyGuard } from '@/router/route-guards'

export default [
  {
    path: '/sign-up/email-confirmation',
    name: 'EmailConfirmation',
    component: () =>
      import(/* webpackChunkName: "sign-up-email-confirmation" */ '@/modules/sign-up/_pages/EmailConfirmation'),
    meta: { secure: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
  {
    path: '/sign-up/',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "sign-up" */ '@/modules/sign-up/_pages/SignUp'),
    meta: { secure: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
  {
    path: '/sign-up/complete/:token',
    name: 'SignUpComplete',
    component: () => import(/* webpackChunkName: "sign-up-complete" */ '@/modules/sign-up/_pages/SignUpComplete'),
    meta: { secure: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
  {
    path: '/sign-up/app-owner',
    name: 'SignUpAppOwner',
    component: () => import(/* webpackChunkName: "sign-up-app-owner" */ '@/modules/sign-up/_pages/SignUpAppOwner'),
    meta: { secure: false, title: VUE_APP_TITLE },
    beforeEnter: unauthenticatedOnlyGuard,
  },
]
