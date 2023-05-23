import { userTypeGuard } from '@/router/route-guards'
import { PROGRAM_MANAGER } from '@/modules/core/models/user-types'

export default [
  {
    path: '/reports/generate/:programUuid?',
    name: 'GenerateReport',
    component: () =>
      import(/* webpackChunkName: "reporting-generate-report" */ '@/modules/reporting/_pages/GenerateReport'),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER]),
  },
  {
    path: '/reports/templates/new',
    name: 'CreateReportTemplate',
    component: () =>
      import(
        /* webpackChunkName: "reporting-create-report-template" */ '@/modules/reporting/_pages/CreateReportTemplate'
      ),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER]),
  },
  {
    path: '/reports/templates/:uuid',
    name: 'EditReportTemplate',
    component: () =>
      import(
        /* webpackChunkName: "reporting-edit-report-template" */ '@/modules/reporting/_pages/CreateReportTemplate'
      ),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER]),
  },
  {
    path: '/reports/templates/',
    name: 'ReportTemplates',
    component: () => import(/* webpackChunkName: "report-templates" */ '@/modules/reporting/_pages/ReportTemplates'),
    meta: { secure: true },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER]),
  },
]
