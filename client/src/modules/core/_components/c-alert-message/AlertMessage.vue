<template>
  <div v-show="this.isOpen" class="c-alert-message" :class="`c-alert-message--${type}`">
    <div>
      <h6>{{ title }}</h6>
      <p>{{ message }}</p>
    </div>

    <!-- close button -->
    <div class="c-alert-message-close" @click="closeAlert">
      <i class="fal fa-times"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertMessage',
  data() {
    return {
      isOpen: true
    }
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    message: {
      type: String,
      default: '',
      required: false,
    },
    type: {
      // info, success or error
      type: String,
      default: 'info',
      required: true,
    },
  },
  methods: {
    closeAlert() {
      this.isOpen = false
    }
  }
}
</script>
