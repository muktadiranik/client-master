<template>
  <div :id="dialogId" class="c-modal" :class="[getActiveClass, getDialogClass]">
    <div class="c-modal__inner">
      <h6 class="u-fs-18">{{ title }}</h6>
      <div class="c-modal__close" v-if="cancelCallback" @click="cancelCallback">
        <i class="fal fa-times u-font-150 u-cursor-pointer"></i>
      </div>

      <!-- /.c-modal__header -->
      <div class="c-modal__body">
        <div>
          <div v-if="text">
            <span>{{ text }}</span>
          </div>
          <div v-if="html">
            <span v-html="html" />
          </div>
        </div>
      </div>
      <!-- /.c-modal__body -->
      <div class="c-modal__footer">
        <div class="u-flex-buttons u-jc-center">
          <button
            v-if="hasCancelButton"
            class="o-btn o-btn--outline o-btn--outline-primary o-btn--sm o-btn--rounded-sm"
            @click.prevent="cancelCallback"
          >
            {{ cancelButtonText }}
          </button>
          <button
            v-if="hasConfirmButton"
            class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
            :class="getDialogClass"
            @click.prevent="confirmCallback"
          >
            {{ confirmButtonText }}
          </button>
          <button
            v-for="(button, index) in buttons"
            :key="`${alertId}-button-${index}`"
            class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
            :class="getDialogClass"
            @click.prevent="button.callback"
          >
            {{ button.text }}
          </button>
        </div>
      </div>
      <!-- /.c-modal__footer -->
    </div>
    <!-- /.c-modal__inner -->
  </div>
  <!-- /.c-modal -->
</template>

<script>
export default {
  name: 'CaDialog',
  props: {
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
    dialogId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'confirmation',
      required: false,
    },
    text: {
      type: String,
      default: '',
      required: false,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },
    html: {
      type: String,
      default: '',
      required: false,
    },
    hasCancelButton: {
      type: Boolean,
      default: false,
      required: false,
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel',
      required: false,
    },
    cancelCallback: {
      type: Function,
      default: () => {},
      required: false,
    },
    hasConfirmButton: {
      type: Boolean,
      default: true,
      required: false,
    },
    confirmButtonText: {
      type: String,
      default: 'OK',
      required: true,
    },
    confirmCallback: {
      type: Function,
      default: () => {},
      required: false,
    },
    buttons: {
      type: Array,
      default: () => [],
      required: false,
    },
    dialogClass: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    getActiveClass() {
      return this.active ? 'active' : ''
    },
    getDialogClass() {
      return this.dialogClass || ''
    },
  },
}
</script>
