import { programManagersOnlyGuard, userTypeGuard } from '@/router/route-guards'
import { APPLICATION_OWNER, PROGRAM_MANAGER } from '@/modules/core/models/user-types'

export default [
  {
    path: '/programs/:uuid([A-Za-z0-9]{22})/findings',
    name: 'ProgramFindings',
    component: () => import(/* webpackChunkName: "program-findings" */ '@/modules/findings/_pages/ProgramFindings'),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
    params: { uuid: '' },
  },
  {
    path: '/findings/',
    name: 'Findings',
    component: () => import(/* webpackChunkName: "findings" */ '@/modules/findings/_pages/Findings'),
    meta: { secure: true, title: 'Inspectiv | Vulnerabilities' },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
  {
    path: '/findings/:uuid',
    name: 'Finding',
    component: () => import(/* webpackChunkName: "finding" */ '@/modules/findings/_pages/Finding'),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
  {
    path: '/findings/:uuid/create',
    name: 'CreateFinding',
    component: () => import(/* webpackChunkName: "finding-create" */ '@/modules/findings/_pages/FindingCreate'),
    meta: { secure: true },
    params: { uuid: '', program: undefined },
    beforeEnter: programManagersOnlyGuard,
  },
  {
    path: '/findings/:programUuid/edit/:findingUuid',
    name: 'EditFinding',
    component: () => import(/* webpackChunkName: "finding-edit" */ '@/modules/findings/_pages/FindingEdit'),
    meta: { secure: true },
    params: { findingUuid: '', programUuid: '' },
    beforeEnter: programManagersOnlyGuard,
  },
]
