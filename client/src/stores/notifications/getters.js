import {
  GET_DISPLAYED_NOTIFICATION,
  GET_NEXT_PAGE,
  GET_NOTIFICATIONS,
  GET_NOTIFICATION_DURATION,
  GET_UNREAD_NOTIFICATIONS,
  HAS_UNREAD_NOTIFICATIONS,
} from '@/stores/notifications/types'

export default {
  [GET_NEXT_PAGE]: state => state.nextPage,
  [GET_NOTIFICATIONS]: state => state.notifications,
  [GET_NOTIFICATION_DURATION]: state => state.notificationDuration,
  [GET_UNREAD_NOTIFICATIONS]: state => state.notifications.filter(x => x.unread),
  [HAS_UNREAD_NOTIFICATIONS]: state => state.notifications.some(n => n.unread === true),
  [GET_DISPLAYED_NOTIFICATION]: state => state.displayNotification,
}
