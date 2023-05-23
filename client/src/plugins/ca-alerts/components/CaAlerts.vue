<template>
  <div></div>
</template>

<script>
import CaAlert from '@/plugins/ca-alerts/components/CaAlert'
import { events } from '@/plugins/ca-alerts/events'
import alertMixin from '@/plugins/ca-alerts/mixins/alert-mixin'
import Vue from 'vue'

export default {
  name: 'CaAlerts',
  mixins: [alertMixin],
  data() {
    return {
      alerts: [],
      defaultTimeout: 4000,
    }
  },
  methods: {
    createAlert(options) {
      const alertId = options.id || this.generateAlertId()
      if (this.alertExists(alertId)) {
        return
      }

      let props = {
        text: options.text || '',
        type: options.type || 'informational',
        buttons: options.buttons,
        closable: options.closable,
        closing: false,
        alertId: alertId,
        updatedFormFields: options.updatedFormFields || [],
        iconClass: options.iconClass || this.getAlertIconClass(options.type),
        position: options.position || 'bottom',
        container: options.container || 'CaAlerts',
        customClass: options.customClass || '',
      }

      let CaAlertComponentClass = Vue.extend(CaAlert)
      let CaAlertComponent = new CaAlertComponentClass({
        propsData: props,
        data: {
          active: true,
          container: options.container || 'CaAlerts',
        },
      }).$mount()

      const container = this.$parent.$refs[CaAlertComponent.$data.container]
      container.appendChild(CaAlertComponent.$el)

      this.alerts.push(CaAlertComponent)
      this.setAlertTimeout(CaAlertComponent)
    },
    generateAlertId() {
      return Math.round(new Date().getTime() / 1000).toString()
    },
    getAlertIconClass(alertType) {
      if (!alertType) {
        return ''
      }

      switch (alertType) {
        case 'action':
          return 'fa fa-fw fa-check'
        case 'error':
          return 'fa fa-fw fa-exclamation-circle'
        case 'success':
          return 'fas fa-fw fa-check-circle'
        case 'informational':
          return 'far fa-fw fa-info-circle'
        case 'warn':
          return 'far fa-fw fa-exclamation-circle'
        default:
          return ''
      }
    },
    setAlertTimeout(alert) {
      const alertType = alert.type.toLowerCase()

      if (alertType === 'success' || alertType === 'error') {
        setTimeout(() => {
          this.closeAlert(alert.alertId)
        }, this.defaultTimeout)
      }
    },
    updateAlert(options) {
      const alertIndex = this.alerts.findIndex(x => x.alertId === options.id)
      this.alerts[alertIndex].$data.text = options.text || ''
      this.alerts[alertIndex].$data.html = options.html || ''
      this.alerts[alertIndex].$data.updatedFormFields = options.updatedFormFields || []
      this.alerts[alertIndex].$data.buttons = options.buttons
    },
    createOrUpdateAlert(options) {
      const alertIndex = this.alerts.findIndex(x => x.alertId === options.id)
      alertIndex === -1 ? this.createAlert(options) : this.updateAlert(options)
    },
    alertExists(id) {
      return this.alerts.findIndex(x => x.alertId === id) > -1
    },
    closeAlert(id) {
      const alertIndex = this.alerts.findIndex(x => x.alertId === id)
      if (alertIndex <= -1) {
        return
      }

      this.alerts[alertIndex].closing = true
      this.alerts[alertIndex].$data.active = false
      this.alerts[alertIndex].$destroy()
      const container = this.alerts[alertIndex].$data.container
      this.$parent.$refs[container].removeChild(this.alerts[alertIndex].$el)

      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x.alertId !== id)
      }, 10)
    },
  },
  mounted() {
    events.$on('CA_ALERT_CLOSE', payload => {
      this.closeAlert(payload)
    })
    events.$on('CA_ALERT_CREATE', payload => {
      this.createAlert(payload)
    })
    events.$on('CA_ALERT_ACTION', payload => {
      this.createAlert(payload)
    })
    events.$on('CA_ALERT_WARN', payload => {
      this.createAlert(payload)
    })
    events.$on('CA_ALERT_SUCCESS', payload => {
      this.createAlert(payload)
    })
    events.$on('CA_ALERT_ERROR', payload => {
      this.createAlert(payload)
    })
    events.$on('CA_ALERT_INFO', payload => {
      this.createAlert(payload)
    })
    events.$on('CA_ALERT_UPDATE', payload => {
      this.updateAlert(payload)
    })
    events.$on('CA_ALERT_CREATE_OR_UPDATE', payload => {
      this.createOrUpdateAlert(payload)
    })
  },
}
</script>
