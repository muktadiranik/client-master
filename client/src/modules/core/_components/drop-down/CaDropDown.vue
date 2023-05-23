<template>
  <div class="ca-drop-down" :class="direction" v-show="visible">
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    direction: {
      type: String,
      default: 'center',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
}
</script>
