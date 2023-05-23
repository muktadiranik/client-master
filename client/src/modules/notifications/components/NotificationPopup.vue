<template>
  <div class="notification-popup">
    <div class="notification-popup__content">
      <img :src="notification.image" :alt="notification.image" />
      <p>
        <span>{{ notification.body }}</span>
      </p>
    </div>
    <i class="fal fa-times-circle" @click="closeNotification()"></i>
  </div>
</template>

<script>
import { NotificationsMixin } from '@/mixins/notifications'

export default {
  name: 'NotificationPopup',
  mixins: [NotificationsMixin],
  props: {
    notification: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  methods: {
    closeNotification() {
      this.markRead(this.notification)
    },
  },
}
</script>
