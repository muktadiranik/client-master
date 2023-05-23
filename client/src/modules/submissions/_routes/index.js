import {userTypeGuard} from '../../../router/route-guards'
import {PROGRAM_MANAGER} from '../../core/models/user-types'

export default [
  {
    path: '/submissions/:programUuid/edit/:submissionUuid',
    name: 'SubmissionEdit',
    component: () => import(/* webpackChunkName: "submission-edit" */ '@/modules/submissions/_pages/SubmissionEdit'),
    meta: { secure: true },
    params: {
      programUuid: '',
      submissionUuid: '',
    },
  },
  {
    path: '/submissions/:uuid/create',
    name: 'SubmissionCreate',
    component: () =>
      import(/* webpackChunkName: "submission-create" */ '@/modules/submissions/_pages/SubmissionCreate'),
    meta: { secure: true, title: VUE_APP_TITLE },
  },
  {
    path: '/submissions/',
    name: 'Submissions',
    component: () => import(/* webpackChunkName: "submissions" */ '@/modules/submissions/_pages/Submissions'),
    meta: { secure: true, title: 'Inspectiv | Submissions' },
  },
  {
    path: '/submissions/:uuid',
    name: 'Submission',
    component: () => import(/* webpackChunkName: "submission" */ '@/modules/submissions/_pages/Submission'),
    meta: { secure: true },
    props: route => ({
      ...route.params,
    }),
  },
   {
    path: '/submissions/:uuid/download/:attachmentUUID',
    name: 'SubmissionAttachmentDownload',
    component: () => import(/* webpackChunkName: "submission" */ '@/modules/submissions/_pages/Submission'),
    meta: { secure: true },
    props: route => ({
      ...route.params,
    }),
    beforeEnter: userTypeGuard([ PROGRAM_MANAGER ], {name: 'NotFound'}),
   },
]
