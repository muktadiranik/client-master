<template>
  <main class="c-site-main" v-if="showSubmissionEditor">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <router-link :to="{ name: 'Submission', params: { uuid: submission.uuid } }">
          <button class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
            <i class="fal fa-arrow-left o-btn--icon-sm"></i>
            Back
          </button>
        </router-link>
        <form class="c-form l-form u-width-50" v-on:submit.prevent>
          <h6 class="o-h6">Edit Submission</h6>
          <!-- Submission Title -->
          <div class="c-form__group l-form__horinzontal u-mt-24">
            <label for="submission_title">
              <h6 class="u-fs-14">Title</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">Help us get an idea of what this vulnerability is about.</p>
            </label>
            <div>
              <input
                type="text"
                v-model="submissionEditForm.title"
                placeholder="Enter the name of the submission"
                name="submission_title"
                id="submission_title"
                class="o-input"
              />
              <div
                v-if="submissionEditForm.title.length !== 0"
                class="o-input-maxchar-countdown"
                v-bind:class="titleCharCountdown < 0 ? 'o-input--maxchars' : ''"
              >
                {{ titleCharCountdown }} characters remaining
              </div>
            </div>
          </div>

          <!-- Submission Vulnerability Types -->
          <div class="c-form__group l-form__horinzontal u-mt-32">
            <label>
              <h6 class="u-fs-14">Vulnerability Types</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">Select the type of the potential issue you have discovered.</p>
            </label>
            <VulnerabilityTypeEditor
              :report-vulnerability-types="submissionEditForm.vulnerability_types"
              @on-add-vulnerability-type="addOrRemoveVulnerabilityType"
            />
          </div>

          <!-- Submission Details -->
          <div class="c-form__group l-form__horinzontal u-mt-32">
            <label for="submission-details-editor">
              <h6 class="u-fs-14">Details</h6>
              <p class="o-text u-fs-11 u-mt-8 u-mb-10">Describe the vulnerability and its impact.</p>
            </label>
            <div>
              <markdown-editor
                v-model="submissionEditForm.details"
                id="submission-details-editor"
                :configs="markdownConfig"
                placeholder="Enter details for this submission. Include endpoints exploited."
                name="submission_details"
              />
              <!-- <div
                v-if="submissionEditForm.details.length !== 0"
                class="o-input-maxchar-countdown"
                v-bind:class="detailsCharCountdown < 0 ? 'o-input--maxchars' : ''"
              >
                {{ detailsCharCountdown.toLocaleString() }} characters remaining
              </div> -->
            </div>
          </div>

          <!-- Submission Attachments -->
          <div class="c-form__group l-form__horinzontal u-mt-32">
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
              :allowDeleting="true"
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
              :disabled="submitDisabled || !submissionHasUpdates || loading"
              @click.prevent="submitForm()"
              v-dynamic-color
            >
              <span>Update Submission</span>
            </button>
          </div>
        </form>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { dynamicColor } from '@/directives/dynamic-color'

import {
  STORE_KEY,
  DELETE_ATTACHMENT,
  EDIT_SUBMISSION,
  GET_SUBMISSION,
  UPLOAD_ATTACHMENT,
} from '@/modules/submissions/_store/types'
import store from '@/modules/submissions/_store'
import CaFileUpload from '@/modules/core/_components/ca-file-upload/CaFileUpload'
import VulnerabilityTypeEditor from '@/modules/vulnerability-types/components/VulnerabilityTypeEditor'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'SubmissionEdit',
  mixins: [BreadcrumbsMixin],
  directives: {
    dynamicColor,
  },
  data() {
    return {
      caFileAttachments: [],
      attachmentFile: File,
      pendingAttachments: [],
      files: [],
      submissionEditForm: {
        title: '',
        attachment: '',
        details: '',
        filename: '',
        vulnerability_types: [],
      },
      submission: {
        attachment: '',
        details: '',
        filename: '',
        uuid: '',
        programUuid: '',
        title: '',
      },
      markdownConfig: {
        status: false,
        spellChecker: false,
      },
      loading: false,
      showSubmissionEditor: false,
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
  methods: {
    addOrRemoveVulnerabilityType(vulnerabilityType) {
      this.submissionEditForm.vulnerability_types = [vulnerabilityType]
    },
    async uploadAttachments() {
      const pendingAttachments = this.caFileAttachments.filter(x => x.pending)

      const errored = []
      for (let i = 0, len = pendingAttachments.length; i < len; i++) {
        const index = this.caFileAttachments.findIndex(x => x.uuid === pendingAttachments[i].uuid)
        try {
          this.$set(this.caFileAttachments[index], 'loading', true)

          const response = await this.uploadAttachment({
            formData: pendingAttachments[i].formData,
            submissionUuid: this.$route.params.submissionUuid,
          })

          this.submission = { ...response.data }

          this.$delete(this.caFileAttachments, index)
          this.setExistingAttachments(response.data.attachments)
        } catch (e) {
          errored.push(e)
        } finally {
          this.$set(this.caFileAttachments[index], 'loading', false)
        }
      }
      if (errored.length > 0) {
        throw new Error('Failed to update one or more attachments. Make sure attachments are under 10MB')
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
          this.$caAlert.success('Attachment removed.')
          throw new Error('Pending attachment was removed.')
        }

        const payload = {
          submissionUuid: this.$route.params.submissionUuid,
          attachmentUuid: data.uuid,
        }

        const response = await this.deleteAttachment(payload)
        this.$caAlert.success('Attachment removed.')

        this.submission = { ...response.data }
        this.$delete(this.caFileAttachments, index)
      } catch (e) {
        if (!data.pending) {
          this.$caAlert.error('Sorry, this attachement cannot be removed at this time.')
        }
      }
    },
    ...mapActions(STORE_KEY, {
      deleteAttachment: DELETE_ATTACHMENT,
      editSubmission: EDIT_SUBMISSION,
      getSubmission: GET_SUBMISSION,
      uploadAttachment: UPLOAD_ATTACHMENT,
    }),
    cancelSubmission() {
      this.$router.push({
        name: 'Submission',
        params: { uuid: this.submission.uuid },
      })
    },
    async submitForm() {
      const payload = {
        submission_uuid: this.submission.uuid,
        program_uuid: this.submission.programUuid,
        details: this.submissionEditForm.details,
        terms: true,
        title: this.submissionEditForm.title,
        attachment: '',
        filename: '',
        status: this.submission.status,
        payout: this.submission.payout,
        resolution: this.submission.resolution,
        vulnerability_types: this.submissionEditForm.vulnerability_types,
      }

      try {
        this.$solar.show()
        this.loading = true

        const response = await this.editSubmission(payload)
        if (response.status !== 200) {
          this.$caAlert.error('Sorry, an error occurred while updating your submission.')
          return
        }

        await this.uploadAttachments()

        this.$caAlert.success('Submission updated.')
        this.$router.push({
          name: 'Submission',
          params: { uuid: this.$route.params.submissionUuid },
        })
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : e.message ? e.message : 'Failed to update submission'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    async loadSubmission() {
      this.files = []
      this.$solar.show()
      this.loading = true
      try {
        const response = await this.getSubmission(this.$route.params.submissionUuid)
        const submission = response.data

        this.submissionEditForm.details = submission.details
        this.submissionEditForm.title = submission.title
        Object.assign(this.submissionEditForm.vulnerability_types, submission.vulnerability_types)
        this.submission = Object.assign(this.submission, submission)
        this.setExistingAttachments(submission.attachments)
      } catch (e) {
        this.$caAlert.error('Sorry, there was an issue loading this submission.')
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
  },
  computed: {
    submitDisabled() {
      return (
        this.loading ||
        !this.submissionEditForm.title ||
        !this.submissionEditForm.details ||
        this.titleCharCountdown < 0 ||
        this.detailsCharCountdown < 0
      )
    },
    vulnerabilityTypesUpdated() {
      let submissionVulnTypes = this.submission.vulnerability_types
      let editedVulnTypes = this.submissionEditForm.vulnerability_types

      submissionVulnTypes = submissionVulnTypes.sort((a, b) => b.name - a.name)
      editedVulnTypes = editedVulnTypes.sort((a, b) => b.name - a.name)
      return JSON.stringify(submissionVulnTypes) !== JSON.stringify(editedVulnTypes)
    },
    submissionHasUpdates() {
      return (
        this.submission.title !== this.submissionEditForm.title ||
        this.submission.details !== this.submissionEditForm.details ||
        (this.caFileAttachments && this.caFileAttachments.length) ||
        this.vulnerabilityTypesUpdated
      )
    },
    disableEditing() {
      if (this.caFileAttachments.length > this.maxUploads) return true

      if (!this.submission) {
        return true
      }

      const findingUuid = this.submission.finding_uuid
      if (findingUuid && findingUuid.length > 0) {
        return true
      }

      return false
    },
    titleCharCountdown() {
      return this.maxTitleChars - this.submissionEditForm.title.length
    },
    detailsCharCountdown() {
      return this.maxDetailsChars - this.submissionEditForm.details.length
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    this.submission.programUuid = this.$route.params.programUuid
    this.submissionUuid = this.$route.params.submissionUuid

    await this.loadSubmission()
    document.title = `Inspectiv | ${this.submission.title}`
    if (this.disableEditing) {
      this.$router.push({
        path: '/submissions',
      })
    } else {
      this.showSubmissionEditor = true
    }

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Submissions' }).route,
      },
      child: {
        title: this.submission.title,
        route: this.$route,
        copyValue: this.submission.uuid,
      },
    })
  },
}
</script>
