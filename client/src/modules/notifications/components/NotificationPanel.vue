<template>
  <div
    class="c-header__topbar-icon u-position-relative"
    @click="$emit('on-toggle')"
    v-show="appOwnerCheck"
    :class="{ 'unread-notification': hasNotifications }"
  >
    <i class="fal fa-bell"></i>
    <ul
      v-show="hasNotifications && notificationsListVisible"
      class="c-submenu c-submenu--right c-submenu--top-right-arrow c-submenu--for-notification"
    >
      <li
        v-for="notification in notifications"
        :key="`notification-${notification.uuid}`"
        class="c-submenu__item u-border-bottom"
        @click="notificationClick(notification)"
      >
        <span class="c-submenu__link l-flex u-ai-start u-jc-sb">
          <div>
            <div class="c-submenu__link-title">{{ notification.title }}</div>
          </div>
          <div class="c-submenu__link-text u-text-right">{{ formatDate(notification.date_created) }}</div>
        </span>
      </li>
      <li class="c-submenu__loadmore" v-show="showLoadMoreButton" @click="loadMoreNotificationsClick">
        Show All Notifications
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { STORE_KEY, MARK_NOTIFICATION_READ } from '@/stores/notifications/types'

import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import { NotificationsMixin } from '@/mixins/notifications'

export default {
  name: 'NotificationPanel',
  data() {
    return {}
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, NotificationsMixin],
  props: {
    appOwnerCheck: {
      type: Boolean,
      default: false,
      required: true,
    },
    notificationsListVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      markRead: MARK_NOTIFICATION_READ,
    }),
    async notificationClick(notification) {
      await this.markRead(notification)
      window.location = notification.url
    },
    async loadMoreNotificationsClick(e) {
      e.stopPropagation()
      await this.loadMoreNotifications()

      const options = {
        container: '.notification-panel',
        easing: 'ease-in',
        force: true,
        x: false,
        y: true,
      }

      this.$scrollTo('.notification-panel-footer', 400, options)
    },
    formatDate(unformattedDate) {
      let date = new Date(unformattedDate)
      return `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    },
  },
  computed: {
    hasNotifications() {
      return this.notifications && this.notifications.length > 0
    },
    notificationPanelClass() {
      return {
        hasNotifications: this.hasNotifications,
      }
    },
    showLoadMoreButton() {
      return !!(this.nextNotificationsPage && this.nextNotificationsPage.length > 0)
    },
  },
}
</script>
