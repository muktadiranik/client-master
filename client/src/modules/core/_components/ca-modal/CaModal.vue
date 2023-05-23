<template>
  <div class="c-modal" v-if="visible">
    <slot name="modal-content"></slot>
  </div>
</template>

<script>
export default {
  name: 'CaModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
}
</script>

<style lang="scss">
.ca-modal {
  width: 500px;
  height: 500px;
  position: absolute;
  left: 50%;
  border: 1px solid #333;
  background-color: #fff;
  margin: 2rem;
}
</style>
