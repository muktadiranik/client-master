<template>
  <span :class="`c-badge--status c-badge--status-${resolution.replace(/\s+/g, '-').toLowerCase()}`">
    {{ formatResolution }}
    <span v-if="formatSecondary"> - {{ formatSecondary }}</span>
  </span>
</template>

<script>
export default {
  props: {
    resolution: {
      type: String,
      required: true,
    },
  },
  computed: {
    formatResolution() {
      if (this.resolution === 'Unresolved') {
        return '-'
      }
      if (this.isSingular(this.resolution)) {
        return this.resolution
      }
      const split = this.resolution.split(' ')
      return split[0]
    },
    formatSecondary() {
      if (this.isSingular(this.resolution)) {
        return ''
      }
      const split = this.resolution.split(' ')
      return split.slice(1).join(' ')
    },
  },
  methods: {
    isSingular(resolution) {
      if (resolution === 'New' || resolution === 'In Progress' || resolution === 'In review') {
        return true
      }
      return false
    },
  },
}
</script>
