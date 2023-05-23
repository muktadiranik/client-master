<template>
  <main class="c-site-main" ondragstart="return false;" ondrop="return false;" ondragover="return false;">
    <ca-file-upload-drag-overlay v-show="dragging" overlay-text="Drop to set program image" />
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <program-edit-form
          :program="program"
          :save-button-disabled="saveButtonDisabled"
          @program-edit-form-updated="onProgramEditFormUpdate"
          @program-edit-form-save="onProgramEditFormSave"
        />
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import ProgramEditForm from '@/modules/programs/_components/ProgramEditForm'
import CaFileUploadDragOverlay from '@/modules/core/_components/ca-file-upload/CaFileUploadDragOverlay'
import { mapActions } from 'vuex'
import { STORE_KEY, CREATE_PROGRAM } from '@/modules/programs/_store/types'
import store from '@/modules/programs/_store'

import { dynamicColor } from '@/directives/dynamic-color'
import { ColorMixin } from '@/mixins/colors'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'ProgramCreate',
  mixins: [AccountMixin, BreadcrumbsMixin, ColorMixin],
  components: {
    CaFileUploadDragOverlay,
    ProgramEditForm,
  },
  directives: {
    dynamicColor,
  },
  data() {
    return {
      program: {},
      newLineRegex: /([\r|\n]+)/g,
      dragging: false,
      lastTarget: null,
    }
  },
  methods: {
    ...mapActions(STORE_KEY, {
      createProgram: CREATE_PROGRAM,
    }),
    cancel() {
      this.$router.go(-1)
    },
    onProgramEditFormUpdate(data) {
      const field = data.field
      const value = data.updatedTo
      this.$set(this.program, field, value)
    },
    async onProgramEditFormSave() {
      try {
        this.$solar.show()
        let payload = {
          ...this.program,
        }

        payload.color = payload.color ? `#${payload.color}` : null

        const response = await this.createProgram(payload)
        this.program = response.data

        this.$caAlert.success('This program has been created.')
        this.$router.push({
          name: 'Program',
          params: { uuid: this.program.uuid },
        })
      } catch (e) {
        const msg = e && e.data && e.data.error ? e.data.error : 'Failed to update program'
        this.$caAlert.error(msg)
      } finally {
        this.$solar.hide()
      }
    },
    onDrop(e) {
      this.dragging = false
      e.preventDefault()
      this.processFiles(e)
    },
    onDragLeave(e) {
      e.preventDefault()
      if (e.target === this.lastTarget) {
        this.dragging = false
      }
    },
    onDragEnter(e) {
      this.lastTarget = e.target
      this.dragging = true
    },
  },
  computed: {
    hexCodeMask() {
      return {
        F: {
          pattern: /[0-9a-fA-F]/,
          transform: v => v.toLocaleUpperCase(),
        },
      }
    },
    saveButtonDisabled() {
      return (
        !this.program.title || !this.program.company_name || !this.program.short_description || !this.program.details
      )
    },
  },
  async mounted() {
    if (!this.userIsProgramManager()) {
      this.$router.go(-1)
      return
    }

    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    this.actionSetBreadcrumbs({ parent: { route: this.$route, title: 'New Program' } })

    const previewedProgram = this.$route.params.previewedProgram
    this.program = previewedProgram || {}

    const defaultProgramDetailsTemplate =
      '# About Us\nA few sentences about our company.\n\n# Scope\nThis is in scope.\n\n# Out of Scope\nThis is out of scope.\n\n# Known vulnerabilities\nThese are known vulnerabilities.'
    this.program.details = previewedProgram ? previewedProgram.details : defaultProgramDetailsTemplate

    window.addEventListener('dragenter', this.onDragEnter)
    window.addEventListener('dragleave', this.onDragLeave)
    window.addEventListener('dragover', this.onDragOver)
    window.addEventListener('drop', this.onDrop)
  },
  beforeDestroy() {
    window.removeEventListener('dragenter', this.onDragEnter)
    window.removeEventListener('dragleave', this.onDragLeave)
    window.removeEventListener('dragover', this.onDragOver)
    window.removeEventListener('drop', this.onDrop)
  },
}
</script>
