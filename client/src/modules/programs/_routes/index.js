import { programManagersOnlyGuard, userTypeGuard } from '@/router/route-guards'
import { APPLICATION_OWNER, PROGRAM_MANAGER } from '@/modules/core/models/user-types'

export default [
  {
    path: '/programs/',
    name: 'Programs',
    component: () => import(/* webpackChunkName: "programs" */ '@/modules/programs/_pages/Programs'),
    meta: { secure: true, title: 'Inspectiv | Programs' },
  },
  {
    path: '/programs/:uuid([A-Za-z0-9]{22})',
    name: 'Program',
    component: () => import(/* webpackChunkName: "program" */ '@/modules/programs/_pages/Program'),
    meta: { secure: true },
    props: route => ({
      ...route.params,
    }),
  },
  {
    path: '/programs/edit/:uuid',
    name: 'ProgramEdit',
    component: () => import(/* webpackChunkName: "program-edit" */ '@/modules/programs/_pages/ProgramEdit'),
    props: route => ({
      ...route.params,
    }),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
  {
    path: '/programs/edit/:uuid?/preview',
    name: 'ProgramEditPreview',
    component: () =>
      import(/* webpackChunkName: "program-edit-preview" */ '@/modules/programs/_pages/ProgramEditPreview'),
    props: route => ({
      ...route.params,
    }),
    meta: { secure: true },
    beforeEnter: programManagersOnlyGuard,
  },
  {
    path: '/programs/create/',
    name: 'ProgramCreate',
    component: () => import(/* webpackChunkName: "program-create" */ '@/modules/programs/_pages/ProgramCreate'),
    meta: { secure: true, title: VUE_APP_TITLE },
    beforeEnter: programManagersOnlyGuard,
  },
  {
    path: '/programs/:uuid/submissions',
    name: 'ProgramSubmissions',
    component: () =>
      import(/* webpackChunkName: "program-submissions" */ '@/modules/programs/_pages/ProgramSubmissions'),
    meta: { secure: true },
  },
]
