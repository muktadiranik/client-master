<template>
  <div>
    <div :class="`c-badge c-badge--${status.toLowerCase()}`" @click="programStatusBadgeClick">
      <span class="u-fs-11">{{ status }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgramStatusBadge',
  components: {},
  props: {
    status: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    badgeClass() {
      return this.status
    },
  },
  methods: {
    programStatusBadgeClick() {
      this.$emit('on-click')
    },
  },
}
</script>
