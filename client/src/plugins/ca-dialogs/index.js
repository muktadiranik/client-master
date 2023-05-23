import CaDialogs from '@/plugins/ca-dialogs/components/CaDialogs'
import { events } from '@/plugins/ca-dialogs/events'

const $caDialog = {
  confirm: options => {
    events.$emit('CA_DIALOG_CONFIRM', {
      type: 'confirmation',
      hasCancelButton: true,
      hasConfirmButton: true,
      ...options,
    })
  },
  close: dialogId => {
    events.$emit('CA_DIALOG_CLOSE', dialogId)
  },
}

const CaDialogPlugin = {
  install(Vue, options) {
    if (this.installed) {
      return
    }

    this.installed = true
    Vue.component(CaDialogs.name, CaDialogs)
    Vue.prototype.$caDialog = $caDialog
  },
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(CaDialogPlugin)
}

export default CaDialogPlugin
