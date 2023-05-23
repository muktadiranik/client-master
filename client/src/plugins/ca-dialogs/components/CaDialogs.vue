<template>
  <div>
    <CaDialog
      v-for="(dialog, index) in dialogs"
      :active="true"
      :key="`ca-dialog-${index}`"
      :dialog-id="dialog.id"
      :dialog-class="dialog.dialogClass"
      :type="dialog.type"
      :title="dialog.title"
      :text="dialog.text"
      :html="dialog.html"
      :buttons="dialog.buttons"
      :has-cancel-button="dialog.hasCancelButton"
      :cancel-button-text="dialog.cancelButtonText"
      :cancel-callback="dialog.cancelCallback"
      :has-confirm-button="dialog.hasConfirmButton"
      :confirm-button-text="dialog.confirmButtonText"
      :confirm-callback="dialog.confirmCallback"
    />
  </div>
</template>

<script>
import CaDialog from '@/plugins/ca-dialogs/components/CaDialog'
import { events } from '@/plugins/ca-dialogs/events'

export default {
  name: 'CaDialogs',
  components: {
    CaDialog,
  },
  data() {
    return {
      dialogs: [],
    }
  },
  methods: {
    createDialog(options) {
      this.dialogs.push({
        id: options.id || `ca-dialog-${Math.round(new Date().getTime() / 1000).toString()}`,
        type: options.type || 'confirmation',
        text: options.text || '',
        title: options.title || '',
        html: options.html,
        buttons: options.buttons,
        hasConfirmButton: options.hasConfirmButton,
        confirmButtonText: options.confirmButtonText,
        confirmCallback: options.confirmCallback,
        hasCancelButton: options.hasCancelButton,
        cancelButtonText: options.cancelButtonText,
        cancelCallback: options.cancelCallback,
        dialogClass: options.dialogClass,
      })
    },
    closeDialog(id) {
      this.dialogs = this.dialogs.filter(x => x.id !== id)
    },
  },
  mounted() {
    events.$on('CA_DIALOG_CLOSE', payload => {
      this.closeDialog(payload)
    })
    events.$on('CA_DIALOG_CONFIRM', payload => {
      this.createDialog(payload)
    })
  },
}
</script>
