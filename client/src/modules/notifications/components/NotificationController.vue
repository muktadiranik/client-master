<template>
  <div class="notification-popup-list-item">
    <NotificationPopup v-if="displayedNotification" :notification="displayedNotification" />
  </div>
</template>

<script>
import NotificationPopup from '@/modules/notifications/components/NotificationPopup'
import { NotificationsMixin } from '@/mixins/notifications'
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'NotificationController',
  components: {
    NotificationPopup,
  },
  mixins: [AccountMixin, NotificationsMixin],
  data() {
    return {}
  },
  async mounted() {
    await this.getNotifications()
    await this.startNotificationPoll()
  },
}
</script>
