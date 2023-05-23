<template>
  <div
    :id="alertId"
    class="c-alert c-alert--fixed-bottom c-alert--padding-lg"
    :class="[alertClass, customClass]"
    v-if="active"
  >
    <div class="c-alert__inner">
      <div class="u-space-between u-ai-center u-nm-10">
        <div class="u-m-10">
          <div class="u-d-f u-ai-center">
            <span class="u-font-16" v-show="text" v-html="text"></span>
            <span class="u-font-16" v-show="isFormUpdate" v-html="formUpdateHtml" />
          </div>
        </div>
        <div class="u-m-10">
          <div class="u-d-f u-ai-center u-flex-wrap u-nm-10">
            <template v-if="buttons">
              <button
                v-for="(button, index) in buttons"
                :key="`${alertId}-button-${index}`"
                :id="`ca-alert-button-${index}`"
                class="o-btn o-btn--primary o-btn--rounded-sm u-m-10"
                @click="button.callback"
              >
                {{ button.text }}
              </button>
            </template>
            <button class="o-btn o-btn--icon u-m-10" v-show="closable" @click="exitClick()">
              <i class="fal fa-times u-font-150 u-color-white"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { events } from '@/plugins/ca-alerts/events'
import alertMixin from '@/plugins/ca-alerts/mixins/alert-mixin'

export default {
  name: 'CaAlert',
  mixins: [alertMixin],
  props: {
    alertId: {
      type: String,
      required: true,
    },
    buttons: {
      type: Array,
      default: () => [],
      required: false,
    },
    closable: {
      type: Boolean,
      default: true,
      required: false,
    },
    closing: {
      type: Boolean,
      required: false,
    },
    text: {
      type: String,
      default: '',
      required: false,
    },
    type: {
      type: String,
      default: 'informational',
      required: false,
    },
    iconClass: {
      type: String,
      default: '',
      required: false,
    },
    position: {
      type: String,
      default: 'bottom',
      required: false,
    },
    updatedFormFields: {
      type: Array,
      default: () => [],
      required: false,
    },
    customClass: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      active: true,
    }
  },
  computed: {
    alertClass() {
      let alertClass = []
      let type = 'informational'
      switch (this.type.toLowerCase()) {
        case 'action':
          type = 'c-alert--action'
          break
        case 'error':
          type = 'c-alert--error'
          break
        case 'formupdate':
          type = 'c-alert--form-update'
          break
        case 'informational':
          type = 'c-alert--informational'
          break
        case 'success':
          type = 'c-alert--success'
          break
        case 'warn':
          type = 'c-alert--warning'
          break
      }
      alertClass.push(type)
      alertClass.push(this.closing ? 'closing' : '')
      alertClass.push(this.position === 'top' ? 'top' : 'bottom')
      return alertClass
    },
    isFormUpdate() {
      return this.type.toLowerCase() === 'formupdate'
    },
    formUpdateHtml() {
      return this.getFormUpdateAlertHtml(this.updatedFormFields)
    },
  },
  methods: {
    exitClick() {
      events.$emit('CA_ALERT_CLOSE', this.alertId)
    },
  },
}
</script>
