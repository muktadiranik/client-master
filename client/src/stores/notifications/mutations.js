import {
  ADD_NOTIFICATIONS,
  RESET_STORE,
  SET_NOTIFICATIONS,
  START_POLL,
  STOP_POLL,
  UPDATE_CURRENT_PAGE,
  UPDATE_NEXT_PAGE,
  UPDATE_LAST_POLL_DATE,
} from '@/stores/notifications/types'
import { initialState } from '@/stores/notifications/state'
import Vue from 'vue'

export default {
  [ADD_NOTIFICATIONS](state, payload) {
    const notifications = [...state.notifications, ...payload]
    Vue.set(state, 'notifications', notifications)
  },
  [RESET_STORE](state) {
    state = { ...initialState }
  },
  [START_POLL](state, poll) {
    if (state.poll === undefined) {
      state.poll = setInterval(poll, state.notificationInterval)
    }
  },
  [STOP_POLL](state) {
    clearInterval(state.poll)
    state.poll = undefined
  },
  [SET_NOTIFICATIONS](state, payload) {
    state.notifications = payload
    if (!state.notifications) {
      return
    }

    const unreadNotifications = state.notifications.filter(x => {
      return x.unread && new Date(x.date_created) > state.lastPoll
    })

    if (!unreadNotifications || unreadNotifications.length === 0) {
      state.displayNotification = undefined
      return
    }

    const notification = unreadNotifications.sort((a, b) => {
      a = new Date(a.date_created)
      b = new Date(b.date_created)
      return a > b ? -1 : a < b ? 1 : 0
    })[0]

    state.displayNotification = notification || undefined
    if (notification) {
      setTimeout(() => {
        if (state.displayNotification && state.displayNotification.uuid === notification.uuid) {
          state.displayNotification = undefined
        }
      }, state.notificationDuration)
    }
  },
  [UPDATE_CURRENT_PAGE](state, payload) {
    state.currentPage = payload
  },
  [UPDATE_NEXT_PAGE](state, payload) {
    state.nextPage = payload
  },
  [UPDATE_LAST_POLL_DATE](state) {
    state.lastPoll = new Date()
  },
}
