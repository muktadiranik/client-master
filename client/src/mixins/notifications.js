import { mapActions, mapGetters } from 'vuex'
import {
  STORE_KEY,
  GET_DISPLAYED_NOTIFICATION,
  GET_NEXT_PAGE,
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS,
  HAS_UNREAD_NOTIFICATIONS,
  LOAD_NOTIFICATIONS,
  LOAD_MORE_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  RESET_STORE,
  START_POLL,
  STOP_POLL,
} from '@/stores/notifications/types'

export const NotificationsMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      displayedNotification: GET_DISPLAYED_NOTIFICATION,
      notifications: GET_NOTIFICATIONS,
      unreadNotifications: GET_UNREAD_NOTIFICATIONS,
      hasUnreadNotifications: HAS_UNREAD_NOTIFICATIONS,
      nextNotificationsPage: GET_NEXT_PAGE,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      loadNotifications: LOAD_NOTIFICATIONS,
      actionLoadMoreNotifications: LOAD_MORE_NOTIFICATIONS,
      markRead: MARK_NOTIFICATION_READ,
      resetStore: RESET_STORE,
      startPoll: START_POLL,
      stopPoll: STOP_POLL,
    }),
    async markAsRead(notification) {
      await this.markRead(notification)
    },
    async startNotificationPoll() {
      await this.startPoll()
    },
    async stopNotificationPoll() {
      await this.stopPoll()
    },
    async resetNotificationStore() {
      await this.resetStore()
    },
    async getNotifications() {
      await this.loadNotifications()
    },
    async loadMoreNotifications() {
      await this.actionLoadMoreNotifications()
    },
  },
}
