import {
  GET_USER,
  GET_PROFILE,
  GET_PROFILE_IMAGE,
  GET_ASSIGNED_PROGRAMS,
  GET_ENTRY_REDIRECT,
} from '@/stores/account/types'

export default {
  [GET_USER]: state => state.user,
  [GET_PROFILE]: state => state.profile,
  [GET_PROFILE_IMAGE]: state => (state.profile && state.profile.image ? state.profile.image : DEFAULT_USER_IMAGE),
  [GET_ASSIGNED_PROGRAMS]: state =>
    state.profile && state.profile.assigned_programs ? state.profile.assigned_programs : [],
  [GET_ENTRY_REDIRECT]: state => state.entryRedirect,
}
