<template>
  <div class="ca-popover" :class="position" v-show="visible">
    <div class="ca-popover-content">
      <div id="ca-popover-close" class="ca-popover-close" @click.stop="closePopover">
        <i id="ca-popover-close-icon" class="fal fa-times"></i>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaPopover',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    closable: {
      type: Boolean,
      default: false,
      required: false,
    },
    position: {
      type: String,
      default: 'left',
      required: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    closePopover() {
      this.$emit('on-close-popover')
    },
  },
}
</script>

<style lang="scss">
.ca-popover {
  margin: 20px 0;
  position: absolute;
  z-index: 10;

  &:before,
  &:after {
    content: '';
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    background-color: #fff;
    display: block;
    top: -8.5px;
    position: absolute;
    transform: rotate(45deg);
    right: 50%;
  }

  &:after {
    top: -7.5px;
    border: 0;
    background: #fff;
  }

  &.right {
    &:before,
    &:after {
      left: auto;
      right: 56px;
    }
  }

  &.left {
    left: 50%;
    transform: translateX(-50%);
    &:before,
    &:after {
      right: 50%;
    }
  }

  .ca-popover-content {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    padding: 20px;

    .ca-popover-close {
      position: absolute;
      top: 5px;
      right: 10px;
      background: transparent;

      i {
        align-self: flex-end;
        font-size: 24px;
      }
    }
  }
}
</style>
