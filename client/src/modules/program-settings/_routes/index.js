import { userTypeGuard } from '@/router/route-guards'
import { APPLICATION_OWNER, PROGRAM_MANAGER } from '@/modules/core/models/user-types'

export default [
  {
    path: '/programs/:uuid/settings',
    name: 'ProgramSettings',
    component: () =>
      import(/* webpackChunkName: "program-settings-general" */ '@/modules/program-settings/_pages/ProgramSettings'),
    meta: {
      secure: true,
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
  {
    path: '/programs/:uuid/settings/team',
    name: 'ProgramSettingsTeam',
    component: () =>
      import(/* webpackChunkName: "program-settings-team" */ '@/modules/program-settings/_pages/ProgramSettingsTeam'),
    meta: {
      secure: true,
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
  {
    path: '/programs/:uuid/settings/submission-template',
    name: 'ProgramSettingsSubmissionTemplate',
    component: () =>
      import(
        /* webpackChunkName: "program-settings-submission-template" */ '@/modules/program-settings/_pages/ProgramSettingsSubmissionTemplate'
      ),
    meta: {
      secure: true,
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
  {
    path: '/programs/:uuid/settings/integrations',
    name: 'ProgramSettingsIntegrations',
    component: () =>
      import(
        /* webpackChunkName: "program-settings-integrations" */ '@/modules/program-settings/_pages/ProgramSettingsIntegrations'
      ),
    meta: {
      secure: true,
    },
    beforeEnter: userTypeGuard([PROGRAM_MANAGER, APPLICATION_OWNER]),
  },
]
