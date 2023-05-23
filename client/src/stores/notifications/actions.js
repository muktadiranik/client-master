import {
  ADD_NOTIFICATIONS,
  LOAD_NOTIFICATIONS,
  LOAD_MORE_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  POLL_NOTIFICATIONS,
  RESET_STORE,
  SET_NOTIFICATIONS,
  STOP_POLL,
  START_POLL,
  UPDATE_CURRENT_PAGE,
  UPDATE_NEXT_PAGE,
  UPDATE_LAST_POLL_DATE,
} from '@/stores/notifications/types'
import NotificationService from '@/services/api/notification-service'
import { STORE_KEY as SUBMISSIONS_STORE_KEY, RELOAD_SUBMISSIONS } from '@/stores/submissions/types'
import store from '@/stores'
import router from '@/router'

export default {
  async [LOAD_MORE_NOTIFICATIONS]({ commit, state }) {
    const page = state.currentPage + 1
    const response = await NotificationService.getNotifications(page)
    const data = response.data

    commit(ADD_NOTIFICATIONS, data.results)
    commit(UPDATE_CURRENT_PAGE, page)
    commit(UPDATE_NEXT_PAGE, data.next)
  },
  async [LOAD_NOTIFICATIONS]({ commit, dispatch, state }, payload) {
    let notifications = []
    let page = 0
    for (let i = 0, len = state.currentPage; i < len; i++) {
      page++
      commit(UPDATE_CURRENT_PAGE, page)
      const response = await NotificationService.getNotifications(page)
      const results = response.data.results
      commit(UPDATE_NEXT_PAGE, response.data.next)

      if (results && results.length > 0) {
        notifications = [...notifications, ...results]
      }
    }

    commit(SET_NOTIFICATIONS, notifications)
    commit(UPDATE_LAST_POLL_DATE)

    if (SUBMISSIONS_STORE_KEY in store._modules.root._children) {
      const route = router.currentRoute
      if (route && route.name && route.name === 'Submissions') {
        await store.dispatch(`${SUBMISSIONS_STORE_KEY}/${RELOAD_SUBMISSIONS}`)
      }
    }

    return notifications
  },
  async [MARK_NOTIFICATION_READ]({ commit, dispatch }, payload) {
    await NotificationService.markNotificationRead(payload.uuid)
    await dispatch(LOAD_NOTIFICATIONS)
  },
  async [POLL_NOTIFICATIONS]({ state, commit, dispatch, rootGetters }) {
    const user = rootGetters['$account/GET_USER']
    const authenticated = user && user.token

    if (authenticated) {
      if (state.poll !== undefined) {
        await dispatch(LOAD_NOTIFICATIONS)
      }
    } else {
      await dispatch(STOP_POLL)
      await dispatch(RESET_STORE)
    }
  },
  async [START_POLL]({ commit, dispatch }) {
    const pollRequest = async () => {
      await dispatch(POLL_NOTIFICATIONS)
    }

    commit(START_POLL, pollRequest)
  },
  async [STOP_POLL]({ commit }) {
    commit(STOP_POLL)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}
