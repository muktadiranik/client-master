<template>
  <div class="c-popover c-popover--default c-popover--no-arrow" v-show="visible">
    <div class="c-popover__header u-text-center" v-show="title">
      <h6 class="o-h6 u-text-single-line">{{ title }}</h6>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'CesppaPopover',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>
