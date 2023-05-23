import CaAlerts from '@/plugins/ca-alerts/components/CaAlerts'
import { events } from '@/plugins/ca-alerts/events'

const $caAlert = {
  action: (text, options) => {
    events.$emit('CA_ALERT_ACTION', {
      ...(options || {}),
      type: 'action',
      text: text,
    })
  },
  success: (text, options) => {
    events.$emit('CA_ALERT_SUCCESS', {
      ...(options || {}),
      type: 'success',
      text: text,
    })
  },
  error: (text, options) => {
    events.$emit('CA_ALERT_ERROR', {
      ...(options || {}),
      type: 'error',
      text: text,
    })
  },
  info: (text, options) => {
    events.$emit('CA_ALERT_INFO', {
      ...(options || {}),
      type: 'informational',
      text: text,
    })
  },
  warn: (text, options) => {
    events.$emit('CA_ALERT_WARN', {
      ...(options || {}),
      type: 'warn',
      text: text,
    })
  },
  create: options => {
    events.$emit('CA_ALERT_CREATE', options)
  },
  update: options => {
    events.$emit('CA_ALERT_UPDATE', options)
  },
  close: id => {
    events.$emit('CA_ALERT_CLOSE', id)
  },
  createOrUpdate: options => {
    events.$emit('CA_ALERT_CREATE_OR_UPDATE', options)
  },
}

const CaAlertPlugin = {
  install(Vue, options) {
    if (this.installed) {
      return
    }

    this.installed = true
    Vue.component(CaAlerts.name, CaAlerts)
    Vue.prototype.$caAlert = $caAlert
  },
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(CaAlertPlugin)
}

export default CaAlertPlugin
