<template>
  <div class="program-card-status-icon hasTooltip" v-if="showStatusIcon" :data-title="tooltipText">
    <div class="program-card-status-icon__tooltip">
      <i class="far" :class="statusIconClass"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgramCardStatusIcon',
  props: {
    status: {
      type: String,
      default: '',
      required: true,
    },
    private: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    showStatusIcon() {
      if (this.status === 'inactive') {
      }
      return this.statusIconClass || this.private
    },
    statusIconClass() {
      let iconClass = ''
      switch (this.status) {
        case 'frozen':
          iconClass = 'fa-snowflake'
          break
        case 'active':
        case 'inactive':
          if (this.private) {
            iconClass = 'fa-user-secret'
          }
          break
        default:
          iconClass = ''
      }

      return iconClass
    },
    tooltipText() {
      const status = this.status === 'active' ? 'private' : this.status
      return `This program is ${status}`
    },
  },
}
</script>
