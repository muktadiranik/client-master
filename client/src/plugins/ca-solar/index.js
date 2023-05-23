import CaSolar from '@/plugins/ca-solar/components/CaSolar'
import { events } from '@/plugins/ca-dialogs/events'

const $caSolar = {
  show: () => {
    events.$emit('CA_SOLAR_SHOW')
  },
  hide: () => {
    events.$emit('CA_SOLAR_HIDE')
  },
}

const CaSolarPlugin = {
  install(Vue) {
    if (this.installed) {
      return
    }

    this.installed = true
    Vue.component(CaSolar.name, CaSolar)
    Vue.prototype.$solar = $caSolar
  },
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(CaSolarPlugin)
}

export default CaSolarPlugin
