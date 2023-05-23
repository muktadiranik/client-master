import {
  STORE_KEY,
  GET_ASSIGNED_PROGRAMS,
  GET_USER,
  LOAD_PROFILE,
  LOGOUT,
  SET_ENTRY_REDIRECT,
} from '@/stores/account/types'
import { APPLICATION_OWNER, PROGRAM_MANAGER } from '@/modules/core/models/user-types'
import store from '@/stores'
import DashboardRedirectService from '@/services/api/dashboard-redirect-service'

const appOwnersAllowedRoutes = [
  'AccountSettings',
  'AccountSettingsOverview',
  'AccountSettingsPayments',
  'Finding',
  'Findings',
  'ProgramPublic',
  'Programs',
  'Program',
  'ProgramEdit',
  'ProgramSettings',
  'ProgramSettingsSubmissionTemplate',
  'ProgramSettingsTeam',
  'ProgramSettingsIntegrations',
  'ProgramFindings',
]
const allowAppOwners = to => {
  const user = store.getters[`${STORE_KEY}/${GET_USER}`]
  if (!user || user.user_type !== APPLICATION_OWNER) {
    return false
  }

  const assignedPrograms = store.getters[`${STORE_KEY}/${GET_ASSIGNED_PROGRAMS}`]
  if (!assignedPrograms || assignedPrograms.length <= 0) {
    return false
  }

  return to && appOwnersAllowedRoutes.includes(to.name)
}

export function appOwnersOnlyGuard(to, from, next) {
  const user = store.getters[`${STORE_KEY}/${GET_USER}`]
  if (user && user.user_type === APPLICATION_OWNER) {
    next()
  } else {
    next('/')
  }
}

export function programManagersOnlyGuard(to, from, next) {
  const user = store.getters[`${STORE_KEY}/${GET_USER}`]
  if (user && user.user_type === PROGRAM_MANAGER) {
    next()
  } else {
    next(false)
  }
}

export function unauthenticatedOnlyGuard(to, from, next) {
  const user = store.getters[`${STORE_KEY}/${GET_USER}`]
  // prevent navigation to SignUpAppOwner while new signup flow is in development
  if (to.name === 'SignUpAppOwner') {
    next({path: '/'})
  }

  if (!user || !user.token) {
    next()
  } else {
    next({ path: '/' })
  }
}

export function userTypeGuard(userTypes, fallbackRoute = false) {
  return (to, from, next) => {
    const user = store.getters[`${STORE_KEY}/${GET_USER}`]
    if (!user || !userTypes.includes(user.user_type)) {
      next(fallbackRoute ? {...fallbackRoute, params: {'0': to.path}} : fallbackRoute)
    } else {
      next()
    }
  }
}

const updateTitle = to => {
  const title = to && to.meta && to.meta.title ? to.meta.title : ''
  if (!title) {
    return
  }
  document.title = title
}

export function globalBeforeEachGuard(to, from, next) {
  // Update title
  if (to.name === 'Finding') {
    const user = store.getters[`${STORE_KEY}/${GET_USER}`]
    const authenticated = user && user.token
    if (!authenticated) {
      DashboardRedirectService.checkIfRedirect(to.params.uuid).then(res => {
        if (res.status === 202) {
          const redirectLocation = res.data.url
          console.log(`redirecting to ${redirectLocation}`)
          window.location.replace(redirectLocation)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  updateTitle(to)

  const secure = to.matched.some(record => record.meta.secure)
  if (secure) {
    store
      .dispatch(`${STORE_KEY}/${LOAD_PROFILE}`)
      .then(
        response => {
          const profile = response && response.data ? response.data : null
          if (profile && profile.user_type === 'application_owner' && !allowAppOwners(to)) {
            next({ name: 'NotFound' })
          } else {
            store.dispatch(`${STORE_KEY}/${SET_ENTRY_REDIRECT}`, '')
            next()
          }
        },
        e => {
          store.dispatch(`${STORE_KEY}/${LOGOUT}`).then(() => {
            store.dispatch('RESET_ALL_STORES')
            store.dispatch(`${STORE_KEY}/${SET_ENTRY_REDIRECT}`, to.matched ? to.path : '')
          })
        }
      )
      .catch(e => {
        store.dispatch(`${STORE_KEY}/${LOGOUT}`).then(() => {
          store.dispatch('RESET_ALL_STORES')
          store.dispatch(`${STORE_KEY}/${SET_ENTRY_REDIRECT}`, '')
          next({ name: 'LogIn' })
        })
      })
  } else {
    next()
  }
}
