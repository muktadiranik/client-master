import { programManagersOnlyGuard } from '@/router/route-guards'

export default [
  {
    path: '/user/:uuid',
    name: 'UserProfile',
    component: () => import(/* webpackChunkName: "user-profile" */ '@/modules/users/_pages/UserProfile'),
    meta: { secure: true, title: VUE_APP_TITLE },
    params: {
      uuid: '',
    },
    beforeEnter: programManagersOnlyGuard,
  },
]
