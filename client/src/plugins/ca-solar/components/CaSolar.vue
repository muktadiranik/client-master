<template>
  <div class="ca-solar-wrapper">
    <div key="ca-solar" class="ca-solar" v-if="active" :class="visibilityClass" v-dynamic-color />
  </div>
</template>

<script>
import { events } from '@/plugins/ca-dialogs/events'
import { dynamicColor } from '@/directives/dynamic-color'

export default {
  name: 'CaDialogs',
  data() {
    return {
      active: false,
    }
  },
  directives: { dynamicColor },
  computed: {
    visibilityClass() {
      return {
        'solar-show': this.active,
        'solar-hide': !this.active,
      }
    },
  },
  methods: {
    show() {
      this.active = true
    },
    hide() {
      this.active = false
    },
  },
  mounted() {
    events.$on('CA_SOLAR_SHOW', payload => {
      this.show()
    })
    events.$on('CA_SOLAR_HIDE', payload => {
      this.hide()
    })
  },
}
</script>
