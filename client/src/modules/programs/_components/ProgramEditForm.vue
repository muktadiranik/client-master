<template>
  <div class="u-width-50">
    <router-link :to="{ name: 'Programs' }">
      <button class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
        <i class="fal fa-arrow-left o-btn--icon-sm"></i>
        Back
      </button>
    </router-link>
    <h6 class="o-h6 u-mb-20">Create Program</h6>
    <form class="c-form c-form--create-program">
      <div class="l-stack l-stack--form">
        <div class="c-form__group">
          <label class="c-form__label c-form__label--small">Program Logo</label>
          <div class="o-upload-photo">
            <input
              type="file"
              id="program-logo"
              class="u-hide-input"
              accept="image/*"
              ref="attachment"
              @change="handlePhotoChange($event)"
            />
            <label
              class="o-upload-photo__label"
              for="program-logo"
              :class="programLogoClass"
              :style="getBackgroundStyle(program.color)"
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
            class="o-input o-input--sm"
            placeholder="Enter the name of the program"
            id="programTitle"
            @input="programEditFormUpdated('title', $event.target.value)"
            v-model="program.title"
          />
        </div>
        <div class="c-form__group">
          <label for="companyName" class="c-form__label c-form__label--small">Company Name</label>
          <input
            type="text"
            class="o-input o-input--sm"
            id="companyName"
            placeholder="Enter the company name"
            @input="programEditFormUpdated('company_name', $event.target.value)"
            v-model="program.company_name"
          />
        </div>

        <div class="c-form__group">
          <label for="programShortDesc" class="c-form__label c-form__label--small u-d-f u-ai-center u-jc-sb">
            <span>Short Description</span>
            <span>
              <strong>{{ shortDescriptionCharsRemaining }}</strong> chars remaining
            </span>
          </label>
          <textarea
            name="programShortDesc"
            id="programShortDesc"
            class="o-textarea"
            maxlength="140"
            v-model="program.short_description"
            @input="programEditFormUpdated('short_description', $event.target.value)"
            placeholder="Enter a short description of the program."
          ></textarea>
        </div>
        <div class="c-form__group c-form__group--last">
          <label for="programDetails" class="c-form__label c-form__label--small">Details</label>
          <markdown-editor
            id="programDetails"
            name="programDetails"
            v-model="program.details"
            @input="onProgramDetailsInput"
          />
        </div>
      </div>
      <div class="u-d-f-at-500 u-jc-sb u-mt-10">
        <div class="u-flex-buttons u-jc-sb">
          <button
            type="button"
            class="o-btn o-btn--outline o-btn--sm o-btn--outline-coolgrey o-btn--rounded-sm"
            @click="cancel"
            v-dynamic-color
          >
            Cancel
          </button>
          <button
            id="program-preview-button"
            type="button"
            class="o-btn o-btn--outline o-btn--sm o-btn--outline-primary o-btn--rounded-sm"
            @click="previewClick"
            v-dynamic-color
          >
            Preview
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
            Save Program
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { dynamicColor } from '@/directives/dynamic-color'
import { ColorMixin } from '@/mixins/colors'

export default {
  name: 'ProgramEditForm',
  mixins: [ColorMixin],
  directives: {
    dynamicColor,
  },
  props: {
    program: {
      type: Object,
      default: () => {},
      required: false,
    },
    saveButtonDisabled: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  data() {
    return {
      newLineRegex: /([\r|\n]+)/g,
      dragging: false,
      lastTarget: null,
      colorCode: '',
    }
  },
  methods: {
    programEditFormUpdated(field, updatedTo) {
      this.$emit('program-edit-form-updated', {
        field: field,
        updatedTo: updatedTo,
      })
    },
    cancel() {
      this.$router.push({ name: 'Programs' })
    },
    handlePhotoChange(e) {
      const file = e.target.files[0] || null
      if (!file || !file.name || !/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.programEditFormUpdated('attachment', reader.result)
        this.programEditFormUpdated('filename', file.name)
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
        this.programEditFormUpdated('attachment', reader.result)
        this.programEditFormUpdated('filename', file.name)
      }

      reader.readAsDataURL(file)
    },
    onProgramDetailsInput(markdown) {
      this.programEditFormUpdated('details', markdown || '')
    },
    previewClick() {
      this.$router.push({
        name: 'ProgramEditPreview',
        params: {
          program: this.program,
        },
      })
    },
    async save() {
      this.$emit('program-edit-form-save')
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
          transform: (v) => v.toLocaleUpperCase(),
        },
      }
    },
    programLogo() {
      return this.program.attachment || this.program.image
    },
    programLogoClass() {
      return {
        'has-logo': this.program.attachment || this.program.image,
      }
    },
    shortDescriptionCharsRemaining() {
      if (!this.program || !this.program.short_description) {
        return 0
      }

      return 140 - this.program.short_description.length
    },
  },
  async mounted() {
    if (this.previewedProgram) {
      this.program = this.previewedProgram
    }

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
