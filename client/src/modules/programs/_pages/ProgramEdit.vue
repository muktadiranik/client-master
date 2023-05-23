<template>
  <main class="c-site-main" ondragstart="return false;" ondrop="return false;" ondragover="return false;">
    <ca-file-upload-drag-overlay v-show="dragging" overlay-text="Drop to set program image" />
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <button
          @click="cancel"
          class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center"
        >
          <i class="fal fa-arrow-left o-btn--icon-sm"></i>
          Back
        </button>
        <form class="c-form c-form--create-program">
          <div class="u-width-50">
            <h6 class="o-h6 u-mb-20">Edit program</h6>
            <div class="l-stack l-stack--form">
              <div class="c-form__group">
                <label class="c-form__label c-form__label--small">Program Logo</label>
                <div class="o-upload-photo">
                  <input
                    type="file"
                    id="programLogo"
                    class="u-hide-input"
                    accept="image/*"
                    ref="attachment"
                    @change="handlePhotoChange($event)"
                  />
                  <label
                    class="o-upload-photo__label"
                    for="programLogo"
                    :class="programLogoClass"
                    :style="programLogoStyle"
                  >
                    <img :src="programLogo ? programLogo : '/static/images/avatar-endpoint.svg'" :alt="program.title" />
                  </label>
                </div>
                <input
                  type="file"
                  id="program-logo"
                  class="u-hide-input"
                  accept="image/*"
                  ref="attachment"
                  @change="handlePhotoChange($event)"
                />
              </div>
              <div class="c-form__group">
                <label for="programTitle" class="c-form__label c-form__label--small">Program Title</label>
                <input
                  type="text"
                  class="o-input"
                  placeholder="Enter the name of the program"
                  id="programTitle"
                  v-model="programEditForm.title"
                />
              </div>
              <div class="c-form__group">
                <label for="companyName" class="c-form__label c-form__label--small">Company Name</label>
                <input
                  type="text"
                  class="o-input"
                  id="companyName"
                  placeholder="Enter the company name"
                  v-model="programEditForm.company_name"
                />
              </div>
              <div class="c-form__group">
                <label for="programShortDesc" class="c-form__label c-form__label--small u-d-f u-jc-sb">
                  <span>Short Description</span>
                  <span
                    ><strong>{{ shortDescriptionCharsRemaining }}</strong> chars remaining</span
                  >
                </label>
                <textarea
                  name="programShortDesc"
                  id="programShortDesc"
                  class="o-textarea"
                  maxlength="140"
                  v-model="programEditForm.short_description"
                  placeholder="Enter a short description of the program."
                ></textarea>
              </div>
              <div class="c-form__group c-form__group--last">
                <label for="programDetails" class="c-form__label c-form__label--small">Details</label>
                <markdown-editor
                  id="programDetails"
                  name="programDetails"
                  v-model="programEditForm.details"
                  :configs="markdownConfig"
                  @input="onProgramDetailsInput"
                />
              </div>
            </div>
            <div class="u-d-f-at-500 u-jc-sb u-mt-10">
              <div class="u-flex-buttons u-jc-sb">
                <button
                  type="button"
                  class="o-btn o-btn--sm o-btn--outline o-btn--outline-coolgrey o-btn--rounded-sm"
                  @click="cancel"
                  v-dynamic-color
                >
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  id="program-preview-button"
                  class="o-btn o-btn--sm o-btn--outline o-btn--outline-primary o-btn--rounded-sm"
                  @click="previewClick"
                  v-dynamic-color
                >
                  <span>Preview</span>
                </button>
              </div>
              <div class="u-hidden u-visible-at-500">
                <button
                  type="button"
                  class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm"
                  :disabled="saveButtonDisabled"
                  @click="save"
                  v-dynamic-color
                >
                  <span>Save Program</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import CaFileUploadDragOverlay from '@/modules/core/_components/ca-file-upload/CaFileUploadDragOverlay'
import { mapActions } from 'vuex'
import { STORE_KEY, EDIT_PROGRAM, GET_PROGRAM } from '@/modules/programs/_store/types'
import store from '@/modules/programs/_store'

import { dynamicColor } from '@/directives/dynamic-color'
import { clickOutside } from '@/directives/click-outside'
import { ColorMixin } from '@/mixins/colors'
import { NavbarMixin } from '@/mixins/navbar'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'

export default {
  name: 'ProgramEdit',
  mixins: [BreadcrumbsMixin, ColorMixin, NavbarMixin],
  components: {
    CaFileUploadDragOverlay,
  },
  directives: {
    clickOutside,
    dynamicColor,
  },
  props: {
    previewedProgram: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      program: {},
      programEditForm: {},
      newLineRegex: /([\r|\n]+)/g,
      dragging: false,
      lastTarget: null,
      colorPickerColor: '',
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
      theme: '',
      inAnimation: false,
      showColorPicker: false,
      markdownConfig: {
        status: false,
        spellChecker: false,
      },
    }
  },
  methods: {
    ...mapActions(STORE_KEY, {
      editProgram: EDIT_PROGRAM,
      getProgram: GET_PROGRAM,
    }),
    cancel() {
      this.$router.push({
        name: 'Program',
        params: { uuid: this.program.uuid },
      })
    },
    changeColor(color) {
      this.programEditForm.color = color.rgba.toHexString()
    },
    createCanvas(cover, coverRect) {
      let canvas = document.createElement('canvas')
      canvas.width = coverRect.width
      canvas.height = coverRect.height

      canvas.getContext('2d').drawImage(cover, 0, 0, coverRect.width, coverRect.height)
      Object.assign(canvas.style, {
        position: 'absolute',
        left: coverRect.left + 'px',
        top: coverRect.top + 'px',
        opacity: 0,
      })
      return canvas
    },
    openSucker(isOpen) {
      if (isOpen) {
        this.isSucking = true
        let image = new Image()
        image.setAttribute('crossorigin', 'Anonymous')
        image.onload = () => {
          let cover = this.$refs.cover
          cover.setAttribute('crossorigin', 'Anonymous')
          cover.src = this.programLogo
          setTimeout(() => {
            const coverRect = cover.getBoundingClientRect()
            const canvas = this.createCanvas(cover, coverRect)
            document.body.appendChild(canvas)
            this.suckerCanvas = canvas
            this.suckerArea = [
              coverRect.left,
              coverRect.top,
              coverRect.left + coverRect.width,
              coverRect.top + coverRect.height,
            ]
          }, 10)
        }
        image.src = this.programLogo
      } else {
        this.suckerCanvas && this.suckerCanvas.remove()
        this.isSucking = false
      }
    },
    async loadProgram() {
      this.$solar.show()
      try {
        const response = await this.getProgram(this.$route.params.uuid)
        this.program = response.data
        this.programEditForm = {
          attachment: '',
          ...this.program,
        }
      } catch (e) {
        this.$caAlert.error('Failed')
      } finally {
        this.$solar.hide()
      }
    },
    handlePhotoChange(e) {
      const file = e.target.files[0] || null
      if (!file || !file.name || !/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.programEditForm.attachment = reader.result
        this.programEditForm.filename = file.name
      }

      reader.readAsDataURL(file)
    },
    processFiles(e) {
      e.preventDefault()
      this.dragging = false

      const file = e.dataTransfer.files[0]

      if (!file || !file.name || !/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.programEditForm.attachment = reader.result
        this.programEditForm.filename = file.name
      }

      reader.readAsDataURL(file)
    },
    onProgramDetailsInput(markdown) {
      this.programEditForm.details = markdown || ''
    },
    previewClick() {
      this.$router.push({
        name: 'ProgramEditPreview',
        params: {
          program: this.programEditForm,
        },
      })
    },
    async save() {
      try {
        this.$solar.show()
        let payload = {
          ...this.programEditForm,
        }
        if (payload.color && !payload.color.includes('#')) {
          payload.color = `#${payload.color}`
        }

        const response = await this.editProgram(payload)
        this.program = response.data
        this.programEditForm = {
          attachment: '',
          ...response.data,
        }

        this.$caAlert.success('This program has been updated.')
        this.$router.push({
          name: 'Program',
          params: { uuid: this.program.uuid },
        })
      } catch (e) {
        this.$caAlert.error('Failed to update program')
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
    toggleColorPicker(e) {
      e.stopPropagation()
      this.showColorPicker = !this.showColorPicker
    },
    hideColorPicker() {
      this.showColorPicker = false
    },
  },
  computed: {
    hexCodeMask() {
      return {
        F: {
          pattern: /[0-9a-fA-F]/,
          transform: (v) => v.toLocaleUpperCase(),
        },
      }
    },
    programLogo() {
      return this.programEditForm.attachment || this.program.image
    },
    programLogoClass() {
      return {
        'has-logo': this.programEditForm.attachment || this.program.image,
      }
    },
    programLogoStyle() {
      if (!this.program) {
        return {}
      }

      let inputColor = this.programEditForm.color
      if (inputColor) {
        inputColor = inputColor.includes('#') ? inputColor : `#${inputColor}`
      }
      const programColor = this.program.color
      const color = inputColor || programColor
      return {
        backgroundColor: color,
      }
    },
    saveButtonDisabled() {
      if (!this.programEditForm.title) {
        return true
      }

      const rgx = this.newLineRegex

      return (
        !this.programEditForm.attachment &&
        this.programEditForm.short_description === this.program.short_description &&
        this.programEditForm.title === this.program.title &&
        this.programEditForm.company_name === this.program.company_name &&
        this.programEditForm.color === this.program.color &&
        this.programEditForm.details.replace(rgx, '\n') === this.program.details.replace(rgx, '\n')
      )
    },
    shortDescriptionCharsRemaining() {
      if (!this.programEditForm || !this.programEditForm.short_description) {
        return 0
      }

      return 140 - this.programEditForm.short_description.length
    },
    colorSuckerClass() {
      return this.programEditForm.attachment || this.program.image ? 'sucking-enabled' : ''
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    await this.loadProgram()
    document.title = `Inspectiv | ${this.program.title}`
    await this.actionLoadProgramForNavbar(this.program)

    if (this.previewedProgram) {
      this.programEditForm = this.previewedProgram
    }

    const parentRoute = this.$router.resolve({ name: 'Programs' }).route
    const parent = { route: parentRoute, title: 'Programs' }

    const childRoute = this.$router.resolve({
      name: 'Program',
      params: { uuid: this.program.uuid },
    }).route
    const child = {
      route: childRoute,
      title: this.program.title,
      copyValue: this.program.uuid,
    }

    const grandChild = { route: this.$route, title: 'Edit' }
    this.actionSetBreadcrumbs({ parent, child, grandChild })

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
