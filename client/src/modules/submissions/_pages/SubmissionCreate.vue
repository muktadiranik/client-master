<template>
  <main class="c-site-main">
    <section class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <router-link :to="{ name: 'Program', params: { uuid: program.uuid } }">
          <button class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
            <i class="fal fa-arrow-left o-btn--icon-sm"></i>
            Back
          </button>
        </router-link>
        <form class="c-form l-form u-width-50" v-on:submit.prevent>
          <h6 class="o-h6">Submit Report</h6>

          <!-- Submission Title -->
          <div class="c-form__group l-form__horizontal u-mt-24">
            <label for="submission_title">
              <h6 class="u-fs-14">Title</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">Help us get an idea of what this vulnerability is about.</p>
            </label>
            <div>
              <input
                type="text"
                v-model="submissionCreateForm.title"
                placeholder="Enter the name of the submission"
                name="submission_title"
                id="submission_title"
                class="o-input"
              />
              <div
                v-if="submissionCreateForm.title.length !== 0"
                class="o-input-maxchar-countdown"
                v-bind:class="titleCharCountdown < 0 ? 'o-input--maxchars' : ''"
              >
                {{ titleCharCountdown }} characters remaining
              </div>
            </div>
          </div>

          <!-- Submission Vulnerability Types -->
          <div class="c-form__group l-form__horizontal u-mt-32">
            <label>
              <h6 class="u-fs-14">Vulnerability Types</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">Select the type of the potential issue you have discovered.</p>
            </label>
            <VulnerabilityTypeEditor
              :report-vulnerability-types="submissionCreateForm.vulnerability_types"
              @on-add-vulnerability-type="addOrRemoveVulnerabilityType"
            />
          </div>

          <!-- Submission Details -->
          <div class="c-form__group l-form__horizontal u-mt-32">
            <label>
              <h6 class="u-fs-14">Details</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">Describe the vulnerability and its impact.</p>
            </label>
            <div>
              <markdown-editor
                v-model="submissionCreateForm.details"
                id="submission-details-editor"
                :configs="markdownConfig"
                name="submission_details"
              />
              <!-- <div
                v-if="submissionCreateForm.details.length !== 0"
                class="o-input-maxchar-countdown"
                v-bind:class="detailsCharCountdown < 0 ? 'o-input--maxchars' : ''"
              >
                {{ detailsCharCountdown.toLocaleString() }} characters remaining
              </div> -->
            </div>
          </div>

          <!-- Submission Attachments -->
          <div class="c-form__group l-form__horizontal u-mt-32">
            <label>
              <h6 class="u-fs-14">Attachments</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">
                Attach proof-of-concept scripts, screenshots, screen recordings, etc.
              </p>
            </label>
            <ca-file-upload
              :attachments="caFileAttachments"
              :binary-form-data="true"
              @on-file-drop="caFileOnFileDrop"
              @on-delete-attachment="caFileOnDeleteAttachment"
            />
          </div>

          <div class="u-mt-24">
            <button
              @click.stop="cancelSubmission()"
              class="o-btn o-btn--outline o-btn--outline-primary o-btn--sm o-btn--rounded u-mr-8"
              v-dynamic-color
            >
              <span>Cancel</span>
            </button>
            <div v-show="loading" class="submission-spinner">
              <Spinner size="medium" />
            </div>
            <button
              id="submit-submission-button"
              class="o-btn o-btn--primary o-btn--sm o-btn--rounded"
              :disabled="submitDisabled"
              @click.prevent="submitForm()"
              v-dynamic-color
            >
              <span>Submit Report</span>
            </button>
          </div>
        </form>
        <!-- /.c-form -->
      </div>
      <!-- /.l-wrap -->
    </section>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import { dynamicColor } from '@/directives/dynamic-color'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import {
  CREATE_SUBMISSION,
  DELETE_ATTACHMENT,
  EDIT_SUBMISSION,
  GET_PROGRAM,
  UPLOAD_ATTACHMENT,
  STORE_KEY,
} from '@/modules/submissions/_store/types'
import store from '@/modules/submissions/_store'
import CaFileUpload from '@/modules/core/_components/ca-file-upload/CaFileUpload'
import VulnerabilityTypeEditor from '@/modules/vulnerability-types/components/VulnerabilityTypeEditor'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'SubmissionCreate',
  data() {
    return {
      caFileAttachments: [],
      attachmentFile: File,
      submissionCreateForm: {
        title: '',
        attachment: '',
        details: '',
        filename: '',
        vulnerabilityTypes: [],
      },
      program: {},
      submissionUuid: '',
      markdownConfig: {
        status: false,
        spellChecker: false,
      },
      loading: false,
      maxTitleChars: 255,
      maxDetailsChars: 32767,
      maxUploads: 20,
    }
  },
  components: {
    CaFileUpload,
    VulnerabilityTypeEditor,
    Spinner,
  },
  directives: {
    dynamicColor,
  },
  mixins: [BreadcrumbsMixin],
  methods: {
    ...mapActions(STORE_KEY, {
      createSubmission: CREATE_SUBMISSION,
      deleteAttachment: DELETE_ATTACHMENT,
      editSubmission: EDIT_SUBMISSION,
      getProgram: GET_PROGRAM,
      uploadAttachment: UPLOAD_ATTACHMENT,
    }),
    async addOrRemoveVulnerabilityType(vulnerabilityType) {
      this.submissionCreateForm.vulnerability_types = [vulnerabilityType]
    },
    async uploadAttachments() {
      const pendingAttachments = this.caFileAttachments.filter(x => x.pending)

      const errored = []
      for (let i = 0, len = pendingAttachments.length; i < len; i++) {
        try {
          const index = this.caFileAttachments.findIndex(x => x.uuid === pendingAttachments[i].uuid)
          this.$set(this.caFileAttachments[index], 'loading', true)

          let response = await this.uploadAttachment({
            formData: pendingAttachments[i].formData,
            submissionUuid: this.submissionUuid,
          })

          this.$set(this.caFileAttachments[index], 'pending', false)

          this.submission = { ...response.data }
          this.$delete(this.caFileAttachments, index)
          this.setExistingAttachments(response.data.attachments)
        } catch (e) {
          errored.push(e)
        }
      }
      if (errored.length > 0) {
        throw new Error('Errored attachments')
      }
    },
    setExistingAttachments(attachments) {
      for (let i = 0, len = attachments.length; i < len; i++) {
        const existingAttachments = this.caFileAttachments.findIndex(x => x.uuid === attachments[i].uuid)
        if (existingAttachments !== -1) {
          continue
        }

        this.$set(this.caFileAttachments, this.caFileAttachments.length, {
          ...attachments[i],
          pending: false,
          loading: false,
          formData: new FormData(),
        })
      }
    },
    caFileOnFileDrop(data) {
      if (this.caFileAttachments.length >= this.maxUploads) {
        this.$caAlert.create({
          text: 'Max number of attachments reached',
          type: 'error',
        })
        return
      }

      const formData = data.formData

      for (let entry of formData.entries()) {
        const file = entry[1]
        if (!file.name || !file.lastModified) {
          continue
        }

        const newFile = {
          uuid: file.name.toString(),
          file_name: file.name.toString(),
          date_created: new Date().toString(),
          file_size: file.size.toString(),
          url: '',
          formData: formData,
          pending: true,
          loading: false,
        }

        this.$set(this.caFileAttachments, this.caFileAttachments.length, newFile)
      }
    },
    async caFileOnDeleteAttachment(data) {
      try {
        const index = this.caFileAttachments.findIndex(x => x.uuid === data.uuid)
        this.$set(this.caFileAttachments[index], 'loading', true)
        if (data.pending) {
          this.$delete(this.caFileAttachments, index)
          this.$caAlert.create({
            type: 'success',
            text: 'Attachment removed.',
          })
          throw new Error('Pending attachment was removed.')
        }

        const payload = {
          submissionUuid: this.submissionUuid,
          attachmentUuid: data.uuid,
        }

        const response = await this.deleteAttachment(payload)
        this.$caAlert.create({ type: 'success', text: 'Attachment removed.' })

        this.submission = { ...response.data }
        this.$delete(this.caFileAttachments, index)
      } catch (e) {
        if (!data.pending) {
          this.$caAlert.error('Sorry, this attachment cannot be removed at this time.')
        }
      }
    },
    cancelSubmission() {
      this.$router.go(-1)
    },
    async submitForm() {
      try {
        this.loading = true
        this.$solar.show()

        const payload = {
          program_uuid: this.$route.params.uuid,
          details: this.submissionCreateForm.details,
          terms: true,
          title: this.submissionCreateForm.title,
          vulnerability_types: this.submissionCreateForm.vulnerability_types,
        }

        const response = await this.createSubmission(payload)
        if (response.status !== 201) {
          this.$caAlert.create({
            type: 'error',
            text: 'Sorry, an error occurred while creating your submission.',
          })
        }

        this.submissionUuid = response.data.uuid
        await this.uploadAttachments()

        this.$caAlert.create({
          type: 'success',
          text: 'Your submission has been created.',
        })
      } catch (e) {
        if (this.submissionUuid) {
          this.$caAlert.create({
            type: 'informational',
            text:
              'Your submission was created, but one or more of your attachments failed to upload. Make sure attachments are under 100MB',
          })
        } else {
          this.$caAlert.create({
            text: 'Sorry, there was an issue creating your submission.',
            type: 'error',
          })
        }
      } finally {
        this.loading = false
        this.$solar.hide()

        if (this.submissionUuid) {
          this.$router.push({
            name: 'Submission',
            params: { uuid: this.submissionUuid },
          })
        }
      }
    },
    async loadProgram() {
      this.$solar.show()
      try {
        const response = await this.getProgram(this.$route.params.uuid)
        this.program = response.data

        this.submissionCreateForm.details = this.program.submission_template
      } catch (e) {
        this.$caAlert.error('Failed to load program')
      } finally {
        this.$solar.hide()
      }
    },
  },
  computed: {
    submitDisabled() {
      if (this.caFileAttachments.length > this.maxUploads) return true

      for (let file of this.caFileAttachments) {
        // bytes to megabytes
        const sizeInMB = file.file_size / 1048576
        if (sizeInMB > 100) {
          return true
        }
      }
      return (
        this.loading ||
        !this.submissionCreateForm.title ||
        !this.submissionCreateForm.details ||
        this.titleCharCountdown < 0 ||
        this.detailsCharCountdown < 0
      )
    },
    titleCharCountdown() {
      return this.maxTitleChars - this.submissionCreateForm.title.length
    },
    detailsCharCountdown() {
      return this.maxDetailsChars - this.submissionCreateForm.details.length
    },
  },
  async created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  async mounted() {
    await this.loadProgram()

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Programs' }).route,
      },
      child: {
        title: this.program.title,
        route: this.$router.resolve({
          name: 'Program',
          params: { uuid: this.program.uuid },
        }).route,
        copyValue: this.program.uuid,
      },
      grandChild: {
        title: 'New Submission',
        route: this.$route,
      },
    })
  },
}
</script>
